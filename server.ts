import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import sql from "mssql";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- SQL Server Config ---
const sqlConfig = {
  user: process.env.SQL_SERVER_USER,
  password: process.env.SQL_SERVER_PASSWORD,
  database: process.env.SQL_SERVER_DATABASE,
  server: process.env.SQL_SERVER_HOST || "localhost",
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: process.env.SQL_SERVER_ENCRYPT === "true",
    trustServerCertificate: true, // For self-signed certificates common in local SQL Express
  }
};

const useMSSQL = !!process.env.SQL_SERVER_HOST;

// --- SQLite Setup ---
const db = new Database("tuition.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    role TEXT,
    password TEXT,
    profile_image TEXT
  );
  CREATE TABLE IF NOT EXISTS tutors (
    id TEXT PRIMARY KEY,
    name TEXT,
    subject TEXT,
    rating REAL,
    reviews INTEGER,
    fee INTEGER,
    image TEXT
  );
  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    sender_id TEXT,
    receiver_id TEXT,
    text TEXT,
    timestamp TEXT
  );
`);

// --- SQL Server Setup Helper ---
async function initMSSQL() {
  if (!useMSSQL) return;
  try {
    const pool = await sql.connect(sqlConfig);
    console.log("Connected to SQL Server Express 2022");
    
    // Create tables if they don't exist
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' AND xtype='U')
      CREATE TABLE users (
        id VARCHAR(50) PRIMARY KEY,
        email VARCHAR(100) UNIQUE,
        role VARCHAR(50),
        password VARCHAR(255),
        profile_image VARCHAR(500)
      );

      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='tutors' AND xtype='U')
      CREATE TABLE tutors (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255),
        subject VARCHAR(255),
        rating FLOAT,
        reviews INT,
        fee INT,
        image VARCHAR(500)
      );

      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='messages' AND xtype='U')
      CREATE TABLE messages (
        id VARCHAR(50) PRIMARY KEY,
        sender_id VARCHAR(50),
        receiver_id VARCHAR(50),
        text NVARCHAR(MAX),
        timestamp VARCHAR(100)
      );
    `);
  } catch (err) {
    console.error("SQL Server connection failed:", err);
  }
}

// Seed Data helper
const seed = async () => {
  // SQLite Seeding
  const userCount = db.prepare("SELECT count(*) as count FROM users").get() as { count: number };
  if (userCount.count === 0) {
    db.prepare("INSERT INTO users (id, email, role, password, profile_image) VALUES (?, ?, ?, ?, ?)").run(
      "admin", "admin@tuitionhub.com", "admin", "admin2626", "https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
    );
  }

  const tutorCount = db.prepare("SELECT count(*) as count FROM tutors").get() as { count: number };
  if (tutorCount.count === 0) {
    const defaultTutors = [
      { id: '1', name: 'Dr. Sarah Jenkins', subject: 'Advanced Mathematics', rating: 4.9, reviews: 124, fee: 45, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400' },
      { id: '2', name: 'Prof. Michael Chen', subject: 'Quantum Physics', rating: 4.8, reviews: 89, fee: 60, image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400' },
      { id: '3', name: 'Emma Wilson', subject: 'English Literature', rating: 5.0, reviews: 215, fee: 35, image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400' }
    ];
    const insertTutor = db.prepare("INSERT INTO tutors (id, name, subject, rating, reviews, fee, image) VALUES (?, ?, ?, ?, ?, ?, ?)");
    defaultTutors.forEach(t => insertTutor.run(t.id, t.name, t.subject, t.rating, t.reviews, t.fee, t.image));
  }

  // SQL Server Seeding (Conditional)
  if (useMSSQL) {
    try {
      const pool = await sql.connect(sqlConfig);
      const res = await pool.request().query("SELECT count(*) as count FROM users");
      if (res.recordset[0].count === 0) {
        await pool.request().query("INSERT INTO users (id, email, role, password, profile_image) VALUES ('admin', 'admin@tuitionhub.com', 'admin', 'admin2626', 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin')");
      }
    } catch (err) {
      console.warn("SQL Server seeding failed (likely connection issue)");
    }
  }
};

seed();
initMSSQL();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API ROUTES ---

  // Auth
  app.post("/api/auth/login", async (req, res) => {
    const { email, password, role } = req.body;
    
    if (useMSSQL) {
      try {
        const pool = await sql.connect(sqlConfig);
        const result = await pool.request()
          .input('email', sql.VarChar, email)
          .input('role', sql.VarChar, role)
          .query("SELECT * FROM users WHERE email = @email AND role = @role");
        
        const user = result.recordset[0];
        if (user && user.password === password) {
          const { password: _, ...userWithoutPassword } = user;
          return res.json({ success: true, user: userWithoutPassword });
        }
      } catch (err) {
        console.error("MSSQL Auth Error:", err);
      }
    }

    // Fallback to SQLite
    const user = db.prepare("SELECT * FROM users WHERE email = ? AND role = ?").get(email, role) as any;
    if (user && user.password === password) {
      const { password: _, ...userWithoutPassword } = user;
      res.json({ success: true, user: userWithoutPassword });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  // Tutors
  app.get("/api/tutors", async (req, res) => {
    if (useMSSQL) {
      try {
        const pool = await sql.connect(sqlConfig);
        const result = await pool.request().query("SELECT * FROM tutors");
        return res.json(result.recordset);
      } catch (err) {
        console.error("MSSQL Tutors Error:", err);
      }
    }
    const tutors = db.prepare("SELECT * FROM tutors").all();
    res.json(tutors);
  });

  // Messages
  app.get("/api/messages/:userId", async (req, res) => {
    const { userId } = req.params;
    if (useMSSQL) {
      try {
        const pool = await sql.connect(sqlConfig);
        const result = await pool.request()
          .input('userId', sql.VarChar, userId)
          .query("SELECT * FROM messages WHERE sender_id = @userId OR receiver_id = @userId ORDER BY timestamp ASC");
        return res.json(result.recordset);
      } catch (err) {
        console.error("MSSQL Messages Select Error:", err);
      }
    }
    const messages = db.prepare("SELECT * FROM messages WHERE sender_id = ? OR receiver_id = ? ORDER BY timestamp ASC").all(userId, userId);
    res.json(messages);
  });

  app.post("/api/messages", async (req, res) => {
    const { id, sender_id, receiver_id, text, timestamp } = req.body;
    
    if (useMSSQL) {
      try {
        const pool = await sql.connect(sqlConfig);
        await pool.request()
          .input('id', sql.VarChar, id)
          .input('sender_id', sql.VarChar, sender_id)
          .input('receiver_id', sql.VarChar, receiver_id)
          .input('text', sql.NVarChar, text)
          .input('timestamp', sql.VarChar, timestamp)
          .query("INSERT INTO messages (id, sender_id, receiver_id, text, timestamp) VALUES (@id, @sender_id, @receiver_id, @text, @timestamp)");
      } catch (err) {
        console.error("MSSQL Messages Insert Error:", err);
      }
    }

    db.prepare("INSERT INTO messages (id, sender_id, receiver_id, text, timestamp) VALUES (?, ?, ?, ?, ?)").run(
      id, sender_id, receiver_id, text, timestamp
    );
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
