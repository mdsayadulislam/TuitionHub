import React, { useState, useRef } from 'react';
import { 
  User, 
  MapPin, 
  BookOpen, 
  DollarSign, 
  Camera, 
  CheckCircle2, 
  LayoutDashboard,
  LogOut,
  Bell,
  Settings,
  X,
  Upload,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Zap,
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  Star,
  GraduationCap,
  Calendar,
  MessageSquare,
  Clock,
  Filter,
  Send,
  MoreVertical,
  Paperclip,
  Smile,
  Video,
  Play,
  Quote,
  Award,
  Book,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
type View = 'landing' | 'auth' | 'student-dashboard' | 'teacher-dashboard' | 'tutor-profile' | 'admin-dashboard';
type Role = 'student' | 'teacher' | 'admin';
type AuthMode = 'signin' | 'signup';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
  isMe: boolean;
}

interface ChatContact {
  id: string;
  name: string;
  role: Role;
  avatar: string;
  lastMessage?: string;
  online?: boolean;
}

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150";

// --- Mock Data ---
const RECOMMENDED_TUTORS = [
  { 
    id: '1', 
    name: "Dr. Aris Thorne", 
    subject: "Quantum Physics", 
    location: "Cambridge, UK", 
    fee: "85", 
    rating: "5.0", 
    reviews: "124", 
    image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=150&h=150",
    bio: "PhD in Theoretical Physics from Cambridge. I specialize in making complex quantum mechanics accessible to students of all levels. My approach combines mathematical rigor with intuitive visualizations.",
    philosophy: "I believe that every student has the potential to understand the universe. My role is to dismantle the barriers of jargon and complex equations, replacing them with wonder and clarity.",
    experience: "15+ years of university teaching",
    education: "PhD Physics, University of Cambridge",
    videoUrl: "#",
    detailedReviews: [
      { user: "Sarah K.", rating: 5, comment: "Dr. Thorne is incredible! He explained concepts I've struggled with for years in just one session.", date: "2 days ago" },
      { user: "Mark J.", rating: 5, comment: "The best physics tutor I've ever had. Very patient and thorough.", date: "1 week ago" }
    ]
  },
  { 
    id: '2', 
    name: "Maria Garcia", 
    subject: "Organic Chemistry", 
    location: "Madrid, ES", 
    fee: "55", 
    rating: "4.9", 
    reviews: "89", 
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150&h=150",
    bio: "Passionate chemist with a background in pharmaceutical research. I've helped hundreds of students master the art of reaction mechanisms and synthesis.",
    philosophy: "Organic chemistry is like a language. Once you learn the basic grammar (mechanisms), you can read and write any reaction in the universe.",
    experience: "8 years of tutoring experience",
    education: "MSc Chemistry, Complutense University of Madrid",
    videoUrl: "#",
    detailedReviews: [
      { user: "Elena R.", rating: 5, comment: "Maria made O-Chem so much less scary! Her diagrams are top notch.", date: "5 days ago" }
    ]
  },
  { 
    id: '3', 
    name: "James Wilson", 
    subject: "Macroeconomics", 
    location: "Chicago, US", 
    fee: "65", 
    rating: "4.8", 
    reviews: "210", 
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150",
    bio: "Former Federal Reserve analyst. I bring real-world economic context to academic theories, helping students understand the 'why' behind the 'what'.",
    philosophy: "Economics isn't just about numbers; it's about decision-making. I teach students to think like economists, evaluating trade-offs and incentives.",
    experience: "10+ years in financial sector",
    education: "MBA, University of Chicago Booth School of Business",
    videoUrl: "#",
    detailedReviews: [
      { user: "Tom B.", rating: 4, comment: "James really knows his stuff. The real-world examples were extremely helpful.", date: "2 weeks ago" }
    ]
  },
];

const MOCK_CONTACTS: ChatContact[] = [
  { id: '1', name: 'Dr. Aris Thorne', role: 'teacher', avatar: RECOMMENDED_TUTORS[0].image, online: true, lastMessage: "Great. I've prepared some new exercises..." },
  { id: '2', name: 'Maria Garcia', role: 'teacher', avatar: RECOMMENDED_TUTORS[1].image, online: false, lastMessage: "See you on Tuesday!" },
  { id: 'student-1', name: 'Alex Student', role: 'student', avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150&h=150", online: true, lastMessage: "Teacher, could we review the last chapter?" },
];

const INITIAL_MESSAGES: Message[] = [
  { id: '1', senderId: '1', senderName: 'Dr. Aris Thorne', text: "Hello! Ready for our session today?", timestamp: new Date(Date.now() - 3600000), isMe: false },
  { id: '2', senderId: 'me', senderName: 'User', text: "Yes, I'm almost ready. Just reviewing the notes.", timestamp: new Date(Date.now() - 3000000), isMe: true },
];

// --- Components ---

const ChatInterface = ({ contact, messages, onSendMessage }: { contact: ChatContact, messages: Message[], onSendMessage: (text: string) => void }) => {
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src={contact.avatar} className="w-10 h-10 rounded-xl object-cover" alt={contact.name} />
            {contact.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>}
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm">{contact.name}</h4>
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">{contact.online ? 'Online Now' : 'Away'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white rounded-lg text-slate-400 transition-colors border border-transparent hover:border-slate-200">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] space-y-1 flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
              <div className={`px-5 py-3 rounded-2xl text-sm font-medium shadow-sm leading-relaxed ${msg.isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'}`}>
                {msg.text}
              </div>
              <p className="text-[9px] text-slate-400 font-bold px-1">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-2 border border-slate-200 focus-within:border-indigo-400 focus-within:bg-white transition-all">
          <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <input 
            type="text" 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..." 
            className="flex-1 bg-transparent border-none outline-none text-sm font-semibold text-slate-700 px-2"
          />
          <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
            <Smile className="w-5 h-5" />
          </button>
          <button 
            onClick={handleSend}
            className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Navbar = ({ 
  onNavigate, 
  onBack,
  showBack,
  currentView, 
  role,
  profileImage
}: { 
  onNavigate: (v: View) => void, 
  onBack: () => void,
  showBack: boolean,
  currentView: View, 
  role: Role | null,
  profileImage: string
}) => (
  <nav className="sticky top-0 z-40 bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <div className="flex items-center gap-3">
        {showBack && (
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-all active:scale-95 border border-slate-100 mr-2"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('landing')}>
          <div className="bg-indigo-600 p-2 rounded-lg">
            <BookOpen className="text-white w-5 h-5" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 italic">TuitionHub</h1>
        </div>
      </div>
      
      <div className="hidden md:flex items-center gap-8">
        {currentView === 'landing' && (
          <>
            <a href="#features" className="text-slate-600 font-medium hover:text-indigo-600 transition-colors">Features</a>
            <a href="#how-it-works" className="text-slate-600 font-medium hover:text-indigo-600 transition-colors">How it Works</a>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        {currentView.includes('dashboard') ? (
          <>
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{role} account</span>
              <span className="text-xs font-bold text-slate-700">{role === 'teacher' ? 'Sarah Jenkins' : 'Alex Student'}</span>
            </div>
            <button className="text-slate-500 hover:text-indigo-600 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-6 w-[1px] bg-slate-200 mx-2" />
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200">
               <img src={profileImage} className="w-full h-full object-cover" alt="User" />
            </div>
            <button 
              onClick={() => onNavigate('landing')} 
              className="flex items-center gap-2 text-slate-700 font-bold hover:text-red-500 transition-colors text-xs uppercase tracking-widest ml-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </>
        ) : (
          <button 
            onClick={() => onNavigate('auth')}
            className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-100 uppercase text-xs tracking-widest"
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  </nav>
);

const Footer = () => (
  <footer className="bg-slate-900 text-slate-400 py-20">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <BookOpen className="text-white w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white italic">TuitionHub</h1>
          </div>
          <p className="max-w-sm leading-relaxed text-slate-400 font-medium">
            Empowering the next generation of learners through high-quality, personalized education from world-class tutors.
          </p>
          <div className="flex items-center gap-4">
            {['twitter', 'facebook', 'instagram', 'linkedin'].map(social => (
              <a key={social} href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
                <span className="sr-only">{social}</span>
                <Users className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 uppercase text-[10px] tracking-widest">Platform</h4>
          <ul className="space-y-4 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">Find a Tutor</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Teach with Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Learning Hub</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 uppercase text-[10px] tracking-widest">Support</h4>
          <ul className="space-y-4 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[10px] font-bold uppercase tracking-widest">© 2024 TuitionHub Global. All rights reserved.</p>
        <p className="text-[10px] font-bold uppercase tracking-widest">Crafted with Precision for Academic Excellence</p>
      </div>
    </div>
  </footer>
);

const AdminDashboard = () => {
  return (
    <div className="space-y-10">
      <header>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Admin Control Panel</h2>
        <p className="text-slate-500 font-medium">Platform overview and management.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Students', value: '4,520', change: '+12%', icon: <Users className="w-5 h-5" /> },
          { label: 'Active Tutors', value: '1,280', change: '+5%', icon: <GraduationCap className="w-5 h-5" /> },
          { label: 'Revenue', value: '$84,200', change: '+18%', icon: <DollarSign className="w-5 h-5" /> },
          { label: 'Active Sessions', value: '312', change: '+24%', icon: <Clock className="w-5 h-5" /> },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                {stat.icon}
              </div>
              <span className="text-emerald-500 text-xs font-black">{stat.change}</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <h4 className="text-2xl font-black text-slate-900">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Recent Platform Activity</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl" />
                  <div>
                    <p className="text-sm font-bold text-slate-800">New Registration: Dr. {['Smith', 'Brown', 'Davis'][item % 3]}</p>
                    <p className="text-[10px] text-slate-400">Teacher Account Verified • 2 mins ago</p>
                  </div>
                </div>
                <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">View</button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 rounded-3xl p-8 text-white space-y-6">
          <h3 className="text-xl font-bold">System Status</h3>
          <div className="space-y-4">
            {['Database', 'App Server', 'Media Relay'].map(sys => (
              <div key={sys} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-sm font-medium">{sys}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-emerald-400">Operational</span>
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                </div>
              </div>
            ))}
          </div>
          <button className="w-full py-4 bg-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all">
            System Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
}

const AuthPage = ({ onAuthSuccess }: { onAuthSuccess: (role: Role, user?: any) => void }) => {
  const [role, setRole] = useState<Role>('student');
  const [mode, setMode] = useState<AuthMode>('signin');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async () => {
    setError('');
    setIsLoading(true);

    try {
      if (role === 'admin') {
        if (password === 'admin2626') {
          onAuthSuccess(role);
        } else {
          setError('Incorrect admin password. Please try again.');
        }
      } else {
        const result = await api.login({ email, password, role });
        if (result.success) {
          onAuthSuccess(role, result.user);
        } else {
          setError(result.message || 'Login failed');
        }
      }
    } catch (err) {
      // Fallback for demo if server is not ready
      if (password === 'pass123') {
         onAuthSuccess(role);
      } else {
         setError('Connection error. Use password "pass123" for demo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-100 rounded-full blur-[120px] -z-10 opacity-60" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
            {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-slate-500 font-medium">Join the elite network of learners and educators.</p>
        </div>

        {/* Role Switcher */}
        <div className="flex p-1 bg-slate-100 rounded-2xl mb-8 relative">
          <motion.div 
            layoutId="role-bg"
            className="absolute inset-y-1 left-1 bg-white rounded-xl shadow-sm z-0"
            style={{ 
              width: 'calc(33.33% - 4px)', 
              x: role === 'student' ? '0%' : role === 'teacher' ? '100%' : '200%' 
            }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
          />
          <button 
            onClick={() => { setRole('student'); setError(''); }}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest relative z-10 transition-colors ${role === 'student' ? 'text-indigo-600' : 'text-slate-500'}`}
          >
            Student
          </button>
          <button 
            onClick={() => { setRole('teacher'); setError(''); }}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest relative z-10 transition-colors ${role === 'teacher' ? 'text-indigo-600' : 'text-slate-500'}`}
          >
            Teacher
          </button>
          <button 
            onClick={() => { setRole('admin'); setError(''); }}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest relative z-10 transition-colors ${role === 'admin' ? 'text-indigo-600' : 'text-slate-500'}`}
          >
            Admin
          </button>
        </div>

        <div className="space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl animate-shake">
              {error}
            </div>
          )}
          {mode === 'signup' && role !== 'admin' && (
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <input type="text" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-semibold" placeholder="e.g. Alex Smith" />
            </div>
          )}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              {role === 'admin' ? 'Admin ID' : 'Email Address'}
            </label>
            <input 
              type={role === 'admin' ? 'text' : 'email'} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-semibold" 
              placeholder={role === 'admin' ? 'Enter Admin ID' : 'alex@example.com'} 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-semibold" 
              placeholder="••••••••" 
            />
          </div>

          <button 
            onClick={handleAuth}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold mt-6 shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
          >
            {role === 'admin' ? 'Submit' : (mode === 'signin' ? 'Sign In' : 'Join Now')} <ArrowRight className="w-4 h-4" />
          </button>

          {role !== 'admin' && (
            <p className="text-center text-sm font-medium text-slate-500 mt-6">
              {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}{' '}
              <button 
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                className="text-indigo-600 font-bold hover:underline"
              >
                {mode === 'signin' ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const TutorProfilePage = ({ tutorId, onBack }: { tutorId: string, onBack: () => void }) => {
  const tutor = RECOMMENDED_TUTORS.find(t => t.id === tutorId) || RECOMMENDED_TUTORS[0];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      {/* Header Profile Section */}
      <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
          <button 
            onClick={onBack}
            className="absolute top-6 left-6 p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-white/30 transition-all border border-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
        
        <div className="px-10 pb-10 relative">
          <div className="flex flex-col md:flex-row items-end gap-6 -mt-20 mb-8">
            <div className="relative group">
              <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl relative z-10">
                <img src={tutor.image} className="w-full h-full object-cover" alt={tutor.name} />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-2xl border-4 border-white flex items-center justify-center z-20 shadow-lg">
                <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
              </div>
            </div>
            
            <div className="flex-1 pb-4">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">{tutor.name}</h2>
                <div className="flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                  <CheckCircle2 className="w-3 h-3" /> Background Verified
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-6 text-slate-500 font-bold text-sm">
                <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-indigo-500" /> {tutor.location}</div>
                <div className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-indigo-500" /> {tutor.subject}</div>
                <div className="flex items-center gap-1.5 text-amber-500"><Star className="w-4 h-4 fill-current" /> {tutor.rating} ({tutor.reviews} reviews)</div>
              </div>
            </div>

            <div className="flex flex-col gap-3 pb-4">
               <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 hover:shadow-indigo-200 active:scale-[0.98] flex items-center justify-center gap-2">
                 Book Now <ArrowRight className="w-5 h-5" />
               </button>
               <button className="px-8 py-4 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl font-bold hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group">
                 <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" /> Send Message
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-slate-100">
            <div className="md:col-span-2 space-y-10">
              {/* Bio Section */}
              <section className="space-y-4">
                <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-500" /> Professional Bio
                </h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {tutor.bio}
                </p>
              </section>

              {/* Philosophy Section */}
              <section className="space-y-4 bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Quote className="w-5 h-5 text-indigo-500" /> Teaching Philosophy
                </h3>
                <p className="text-slate-600 italic leading-relaxed font-medium">
                  "{tutor.philosophy}"
                </p>
              </section>

              {/* Video Intro Section */}
              <section className="space-y-4">
                <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Video className="w-5 h-5 text-indigo-500" /> Video Introduction
                </h3>
                <div className="relative aspect-video bg-slate-900 rounded-[2rem] overflow-hidden group cursor-pointer shadow-2xl">
                   <img 
                    src={`https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800`} 
                    className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-all duration-700" 
                  />
                   <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all">
                       <Play className="w-8 h-8 text-indigo-600 fill-current ml-1" />
                     </div>
                   </div>
                   <div className="absolute bottom-6 left-6 bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl text-white text-xs font-black uppercase tracking-widest border border-white/20">
                     Watch Demo Session
                   </div>
                </div>
              </section>

              {/* Reviews Section */}
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <Star className="w-5 h-5 text-indigo-500" /> Student Reviews
                  </h3>
                  <div className="text-sm font-bold text-slate-400">Showing {tutor.detailedReviews.length} recent reviews</div>
                </div>
                <div className="space-y-4">
                  {tutor.detailedReviews.map((review, i) => (
                    <div key={i} className="p-6 bg-white border border-slate-100 rounded-3xl space-y-3 hover:shadow-md transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 font-black text-xs">
                            {review.user.charAt(0)}
                          </div>
                          <span className="font-bold text-slate-800">{review.user}</span>
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{review.date}</span>
                      </div>
                      <div className="flex gap-1 text-amber-500">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-8">
              {/* Stats Card */}
              <div className="bg-slate-900 rounded-[2rem] p-8 text-white space-y-6 shadow-xl">
                 <div className="space-y-1">
                   <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Hourly Rate</p>
                   <p className="text-4xl font-black">${tutor.fee}<span className="text-sm opacity-50 font-medium">/hour</span></p>
                 </div>
                 <div className="space-y-4 pt-6 border-t border-white/10">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                       <Award className="w-5 h-5 text-indigo-400" />
                     </div>
                     <div>
                       <p className="text-xs font-bold text-white/60">Experience</p>
                       <p className="text-sm font-black">{tutor.experience}</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                       <Book className="w-5 h-5 text-indigo-400" />
                     </div>
                     <div>
                       <p className="text-xs font-bold text-white/60">Education</p>
                       <p className="text-sm font-black">{tutor.education}</p>
                     </div>
                   </div>
                 </div>
                 <button className="w-full py-4 bg-indigo-500 rounded-2xl font-black text-sm hover:bg-indigo-400 transition-colors shadow-lg shadow-indigo-900/50">
                    Book Trial Lesson
                 </button>
              </div>

              {/* Badges Section */}
              <div className="bg-white rounded-[2rem] border border-slate-200 p-8 space-y-6 shadow-sm">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Achievements</h4>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Fast Responder', icon: <Zap className="w-4 h-4" color="#f59e0b" /> },
                    { label: 'Power Tutor', icon: <Award className="w-4 h-4" color="#6366f1" /> },
                    { label: 'Student Favorite', icon: <Heart className="w-4 h-4" color="#ef4444" /> },
                    { label: 'Highly Rated', icon: <Star className="w-4 h-4" color="#fbbf24" /> },
                  ].map((badge, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                      {badge.icon}
                      <span className="text-[10px] font-black text-slate-600 leading-tight">{badge.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const StudentDashboard = ({ 
  activeTab, 
  onTabChange, 
  onTutorSelect, 
  messages, 
  onSendMessage,
  profileImage,
  onPhotoClick
}: { 
  activeTab: string, 
  onTabChange: (tab: string) => void,
  onTutorSelect: (id: string) => void,
  messages: Message[],
  onSendMessage: (text: string) => void,
  profileImage: string,
  onPhotoClick: () => void
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([20, 100]);
  const [minRating, setMinRating] = useState(0);
  const [availability, setAvailability] = useState<'all' | 'online'>('all');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<string[]>([]);

  const filteredTutors = RECOMMENDED_TUTORS.filter(tutor => 
    tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tutor.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const timeStrings = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const timeSlots = ['Morning', 'Afternoon', 'Evening'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Sidebar Navigation */}
      <aside className="lg:col-span-3 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-8">
        <div className="flex items-center gap-4 px-2">
          <div className="relative group cursor-pointer" onClick={onPhotoClick}>
            <div className="w-12 h-12 rounded-xl bg-slate-200 overflow-hidden border border-slate-100 flex items-center justify-center text-indigo-600 transition-all hover:ring-2 hover:ring-indigo-500">
               <img src={profileImage} className="w-full h-full object-cover" alt="Profile" />
               <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <Upload className="w-4 h-4 text-white" />
               </div>
            </div>
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Welcome,</p>
            <h3 className="font-bold text-slate-800">Alex Student</h3>
          </div>
        </div>

        <nav className="space-y-1">
          {[
            { id: 'find', label: 'Find Tutors', icon: <Search className="w-4 h-4" /> },
            { id: 'lessons', label: 'My Lessons', icon: <Calendar className="w-4 h-4" /> },
            { id: 'messages', label: 'Messages', icon: <MessageSquare className="w-4 h-4" />, badge: 2 },
            { id: 'goals', label: 'Learning Goals', icon: <Zap className="w-4 h-4" /> },
            { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === item.id ? 'bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-50/50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                {item.label}
              </div>
              {item.badge && (
                <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full ring-2 ring-white">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-slate-100">
          <div className="p-4 bg-slate-900 rounded-2xl text-white">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Upcoming Class</p>
            <p className="text-sm font-bold mb-3">Math Revision with Sarah</p>
            <div className="flex items-center gap-2 text-[10px] font-bold opacity-80 mb-4">
              <Clock className="w-3 h-3" /> Starts in 45 mins
            </div>
            <button className="w-full py-2 bg-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors">Join Virtual Room</button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:col-span-9 space-y-10">
        {activeTab === 'find' ? (
          <>
            {/* Search & Filter Header */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm overflow-hidden">
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Find your perfect tutor</h2>
                  <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
                    <button 
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setViewMode('calendar')}
                      className={`p-2 rounded-lg transition-all ${viewMode === 'calendar' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                    >
                      <Calendar className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none font-bold text-slate-700 transition-all shadow-inner"
                      placeholder="Search by subject, skills, or tutor name..."
                    />
                  </div>
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-slate-100 ${showFilters ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                  >
                    <Filter className="w-4 h-4" /> {showFilters ? 'Hide Filters' : 'Filters'}
                  </button>
                </div>

                <AnimatePresence>
                  {showFilters && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-8 mt-6 border-t border-slate-100">
                        {/* Price Range */}
                        <div className="space-y-4">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Price Range (Hourly)</label>
                          <div className="flex items-center gap-4">
                            <input 
                              type="range" 
                              min="10" 
                              max="200" 
                              value={priceRange[1]} 
                              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                              className="w-full accent-indigo-600"
                            />
                            <span className="text-sm font-black text-slate-800 tabular-nums">${priceRange[1]}</span>
                          </div>
                          <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span>$10</span>
                            <span>$200+</span>
                          </div>
                        </div>

                        {/* Rating Filter */}
                        <div className="space-y-4">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Minimum Rating</label>
                          <div className="flex gap-2">
                            {[3, 4, 4.5, 5].map((r) => (
                              <button 
                                key={r}
                                onClick={() => setMinRating(r)}
                                className={`flex-1 py-2 rounded-xl text-[10px] font-black transition-all border ${minRating === r ? 'bg-amber-50 border-amber-500 text-amber-700' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-300'}`}
                              >
                                {r}+ ★
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Preferred Days */}
                        <div className="space-y-4">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Preferred Days</label>
                          <div className="flex flex-wrap gap-2">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
                              const dayLabel = timeStrings[idx];
                              const isSelected = selectedDays.includes(dayLabel);
                              return (
                                <button 
                                  key={idx}
                                  onClick={() => setSelectedDays(prev => isSelected ? prev.filter(d => d !== dayLabel) : [...prev, dayLabel])}
                                  className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all border ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-300'}`}
                                >
                                  {day}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Preferred Time Segment */}
                        <div className="space-y-4">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Preferred Time</label>
                          <div className="flex flex-wrap gap-2">
                            {timeSlots.map((slot) => {
                              const isSelected = selectedTimeOfDay.includes(slot);
                              return (
                                <button 
                                  key={slot}
                                  onClick={() => setSelectedTimeOfDay(prev => isSelected ? prev.filter(s => s !== slot) : [...prev, slot])}
                                  className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-300'}`}
                                >
                                  {slot}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {!showFilters && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                  {['Mathematics', 'Physics', 'History', 'Piano', 'Programming'].map((tag, idx) => (
                    <button key={idx} className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-bold whitespace-nowrap hover:bg-indigo-100 hover:text-indigo-600 transition-colors">
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Results Display */}
            {viewMode === 'grid' ? (
              <section>
                <div className="flex items-center justify-between mb-6 px-2">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Top Rated Recommendations</h3>
                    <p className="text-xs text-slate-400 font-medium">Verified tutors with the highest student success rate.</p>
                  </div>
                  <button className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                    View All <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {filteredTutors.length > 0 ? (
                    filteredTutors.map((tutor) => (
                      <motion.div 
                        key={tutor.id}
                        whileHover={{ y: -5 }}
                        onClick={() => onTutorSelect(tutor.id)}
                        className="bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-sm hover:shadow-2xl transition-all group cursor-pointer"
                      >
                        <div className="flex flex-col items-center text-center text-xs">
                          <div className="relative w-24 h-24 mb-4">
                            <div className="w-full h-full rounded-3xl overflow-hidden shadow-xl border-4 border-slate-50">
                              <img src={tutor.image} className="w-full h-full object-cover" alt={tutor.name} />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-lg border-4 border-white flex items-center justify-center">
                              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                            </div>
                          </div>
                          <h4 className="text-lg font-black text-slate-800 leading-tight">{tutor.name}</h4>
                          <div className="flex flex-col items-center gap-1 mb-4">
                            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest leading-none">{tutor.subject}</p>
                            <div className="flex items-center gap-1.5 text-amber-500 font-bold text-[11px]">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-3 h-3 ${i < Math.floor(Number(tutor.rating)) ? 'fill-current' : 'text-slate-200'}`} />
                                ))}
                              </div>
                              <span className="text-slate-400">({tutor.reviews})</span>
                            </div>
                          </div>
                          
                          <div className="w-full pt-4 border-t border-slate-50 mt-auto">
                            <div className="flex items-center justify-between mb-4">
                              <div className="text-left">
                                <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">Pricing</p>
                                <p className="text-sm font-black text-slate-900">${tutor.fee}<span className="text-[10px] text-slate-400">/hr</span></p>
                              </div>
                              <div className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md text-[9px] font-black uppercase tracking-tighter">
                                Trial Offered
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={(e) => { e.stopPropagation(); onTutorSelect(tutor.id); }}
                                className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all text-[10px] uppercase tracking-widest"
                              >
                                Profile
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); alert('Booking initiated!'); }}
                                className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 hover:shadow-indigo-200 active:scale-[0.98] flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest"
                              >
                                Book Now <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full py-20 text-center space-y-4">
                      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                        <Search className="w-10 h-10" />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-slate-900">No tutors found</h4>
                        <p className="text-slate-500 font-medium">Try adjusting your search or filters to find what you're looking for.</p>
                      </div>
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="text-indigo-600 font-bold hover:underline"
                      >
                        Clear all search
                      </button>
                    </div>
                  )}
                </div>
              </section>
            ) : (
              <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-black text-slate-800">Weekly Availability</h3>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                      <button className="p-1 hover:bg-slate-100 rounded-lg"><ChevronLeft className="w-4 h-4" /></button>
                      <span className="min-w-[100px] text-center">April 24 - 30</span>
                      <button className="p-1 hover:bg-slate-100 rounded-lg"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <div className="w-2 h-2 bg-emerald-100 rounded-sm"></div> Available
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <div className="w-2 h-2 bg-slate-50 rounded-sm border border-slate-100"></div> Booked
                    </div>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="p-4 bg-slate-50/50 border-r border-b border-slate-100 w-24"></th>
                        {timeStrings.map((day, idx) => (
                          <th key={day} className="p-4 border-b border-slate-100 min-w-[120px]">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{day}</p>
                            <p className="text-xl font-bold text-slate-800">{24 + idx}</p>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {['09:00', '11:00', '13:00', '15:00', '17:00'].map((time) => (
                        <tr key={time}>
                          <td className="p-4 text-center font-black text-slate-400 text-[10px] border-r border-b border-slate-100">
                            {time}
                          </td>
                          {timeStrings.map((day) => {
                            const isAvailable = Math.random() > 0.4;
                            const sampleTutor = RECOMMENDED_TUTORS[Math.floor(Math.random() * RECOMMENDED_TUTORS.length)];
                            return (
                              <td key={`${day}-${time}`} className="p-2 border-b border-slate-100 group cursor-pointer relative h-24">
                                {isAvailable ? (
                                  <div className="w-full h-full bg-emerald-50 border border-emerald-100 rounded-xl p-2 flex flex-col justify-between transition-all hover:shadow-lg hover:scale-[1.02] group-hover:z-10 bg-opacity-60 backdrop-blur-sm">
                                    <div className="flex items-center gap-1.5 overflow-hidden">
                                      <img src={sampleTutor.image} className="w-5 h-5 rounded-md flex-shrink-0" />
                                      <span className="text-[9px] font-black text-emerald-800 truncate">{sampleTutor.name}</span>
                                    </div>
                                    <button className="flex items-center justify-center gap-1 w-full py-1 bg-white border border-emerald-200 rounded-lg text-[9px] font-black text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                                      BOOK
                                    </button>
                                  </div>
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center opacity-10">
                                    <div className="w-1 h-1 bg-slate-300 rounded-full" />
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </>
        ) : activeTab === 'messages' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Direct Messages</h2>
                <p className="text-xs text-slate-400 font-medium">Connect and collaborate with your instructors.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1 space-y-2">
                 {RECOMMENDED_TUTORS.map((tutor) => (
                   <button 
                    key={tutor.id} 
                    className={`w-full p-4 rounded-3xl flex items-center gap-3 transition-all ${tutor.id === '1' ? 'bg-white shadow-sm border border-slate-200' : 'hover:bg-slate-100 opacity-60'}`}
                   >
                     <img src={tutor.image} className="w-10 h-10 rounded-xl object-cover" />
                     <div className="text-left">
                       <p className="text-sm font-bold text-slate-800">{tutor.name.split(' ').pop()}</p>
                       <p className="text-[10px] text-slate-400 font-medium">Active</p>
                     </div>
                   </button>
                 ))}
              </div>
              <div className="lg:col-span-3">
                <ChatInterface 
                  contact={MOCK_CONTACTS[0]}
                  messages={messages}
                  onSendMessage={onSendMessage}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
               <LayoutDashboard className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Coming Soon</h3>
            <p className="text-slate-400 max-w-xs mx-auto">This dashboard section is under construction. Please check back later!</p>
          </div>
        )}
      </div>
    </div>
  );
};

const LandingPage = ({ onGetStarted }: { onGetStarted: () => void }) => (
  <div className="bg-slate-50 overflow-x-hidden">
    {/* Hero Section */}
    <section className="relative pt-20 pb-32">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-50/50 -skew-x-12 translate-x-1/4 -z-10" />
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }} 
          whileInView={{ opacity: 1, x: 0 }} 
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
            Global teaching network
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tighter">
            A <span className="text-indigo-600">Teacher Student</span> Connector.
          </h1>
          <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
            <span className="block font-black text-slate-900 mb-2">Find your favourite Teacher/Student</span>
            The professional hub for high-end tutors and ambitious students. Build your brand, manage progress, and grow with our premium dashboard.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={onGetStarted}
              className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center gap-2 transform hover:-translate-y-1"
            >
              Get Started Now <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 bg-white text-slate-800 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all">
              Learn More
            </button>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="bg-white rounded-[3rem] p-4 shadow-2xl border border-slate-200 relative z-10 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1544717297-fa154da09f9b?auto=format&fit=crop&q=80&w=800" 
              alt="Teaching" 
              className="rounded-[2.5rem] w-full"
            />
          </div>
          <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 hidden lg:block z-20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase">Total Hub Members</p>
                <p className="text-xl font-bold text-slate-900">12,000+ Active</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Features Section */}
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em]">Platform Features</h2>
          <h3 className="text-4xl font-bold text-slate-900 tracking-tight">Everything you need to succeed</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              icon: <Zap className="w-6 h-6" />, 
              title: "Smart Matching", 
              desc: "Our AI helps students find the perfect tutor based on learning style, goals, and location matching." 
            },
            { 
              icon: <ShieldCheck className="w-6 h-6" />, 
              title: "Verified Excellence", 
              desc: "Every tutor on our platform is strictly verified to ensure top-tier educational standards." 
            },
            { 
              icon: <Users className="w-6 h-6" />, 
              title: "Community Driven", 
              desc: "Join a growing network of educators and learners focused on peer growth and academic success." 
            }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 bg-slate-50 rounded-3xl border border-slate-100 group hover:bg-white hover:shadow-2xl transition-all"
            >
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h4>
              <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Featured Members */}
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em]">Our Community</h2>
          <h3 className="text-4xl font-bold text-slate-900 tracking-tight">Meet our top educators and learners</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Demo Teacher */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[3rem] p-8 border border-slate-200 shadow-xl flex flex-col md:flex-row gap-8 items-center"
          >
            <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-50 flex-shrink-0">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Teacher" />
            </div>
            <div className="space-y-4 text-center md:text-left">
              <div>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">Featured Teacher</span>
                <h4 className="text-2xl font-black text-slate-900 mt-2">Dr. Sarah Jenkins</h4>
                <p className="text-indigo-600 font-bold">Advanced Mathematics Specialist</p>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                "Teaching is not just about spreading knowledge, but about sparking a passion for discovery in every student I encounter."
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {['Calculus', 'Linear Algebra', 'SAT Prep'].map(skill => (
                  <span key={skill} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold">{skill}</span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Demo Student */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[3rem] p-8 border border-slate-200 shadow-xl flex flex-col md:flex-row gap-8 items-center"
          >
            <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-50 flex-shrink-0">
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Student" />
            </div>
            <div className="space-y-4 text-center md:text-left">
              <div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">Top Student</span>
                <h4 className="text-2xl font-black text-slate-900 mt-2">Alex Rivera</h4>
                <p className="text-emerald-600 font-bold">Software Engineering Student</p>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                "With the help of my mentors here, I've managed to bridge the gap between academic theory and real-world application."
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {['React', 'Node.js', 'Algorithms'].map(skill => (
                  <span key={skill} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold">{skill}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

// --- API Client ---
const api = {
  login: async (credentials: any) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return res.json();
  },
  getTutors: async () => {
    const res = await fetch("/api/tutors");
    return res.json();
  },
  getMessages: async (userId: string) => {
    const res = await fetch(`/api/messages/${userId}`);
    return res.json();
  },
  sendMessage: async (msg: any) => {
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(msg),
    });
    return res.json();
  }
};

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [selectedTutorId, setSelectedTutorId] = useState<string | null>(null);
  const [viewHistory, setViewHistory] = useState<View[]>(['landing']);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [activeTab, setActiveTab] = useState('find');
  
  // Messaging States
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);

  // Teacher States
  const [profileData, setProfileData] = useState({
    name: 'Sarah Jenkins',
    subject: 'Advanced Mathematics',
    location: 'London, UK',
    monthlyFee: '450',
    experience: '8 Years',
    status: 'Online Now'
  });
  const [profileImage, setProfileImage] = useState(DEFAULT_AVATAR);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfileImage = () => {
    if (previewImage) {
      setProfileImage(previewImage);
      setIsModalOpen(false);
      setPreviewImage(null);
    }
  };

  const navigate = (v: View) => {
    if (v === 'landing') {
      setUserRole(null);
      setViewHistory(['landing']);
    } else if (v !== view) {
      setViewHistory(prev => [...prev, v]);
    }
    setView(v);
  };

  const handleBack = () => {
    if (viewHistory.length > 1) {
      const newHistory = [...viewHistory];
      newHistory.pop(); // Remove current
      const prevView = newHistory[newHistory.length - 1];
      setView(prevView);
      setViewHistory(newHistory);
      if (prevView === 'landing') {
        setUserRole(null);
      }
    } else {
      navigate('landing');
    }
  };

  const handleAuthSuccess = (role: Role, user?: any) => {
    setUserRole(role);
    if (user && user.profile_image) {
      setProfileImage(user.profile_image);
    }
    if (role === 'admin') {
      navigate('admin-dashboard');
    } else {
      navigate(role === 'teacher' ? 'teacher-dashboard' : 'student-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
      <Navbar 
        onNavigate={navigate} 
        onBack={handleBack}
        showBack={view !== 'landing'}
        currentView={view} 
        role={userRole} 
        profileImage={profileImage}
      />

      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <LandingPage onGetStarted={() => setView('auth')} />
          </motion.div>
        )}

        {view === 'auth' && (
          <motion.div key="auth" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <AuthPage onAuthSuccess={handleAuthSuccess} />
          </motion.div>
        )}

        {view === 'admin-dashboard' && (
          <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-6 py-10">
            <AdminDashboard />
          </motion.div>
        )}

        {view === 'student-dashboard' && (
          <motion.div key="student" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-6 py-10">
            <StudentDashboard 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
              onTutorSelect={(id) => {
                setSelectedTutorId(id);
                navigate('tutor-profile');
              }}
              messages={messages}
              onSendMessage={(text) => {
                const newMessage: Message = {
                  id: Date.now().toString(),
                  senderId: 'me',
                  senderName: 'Alex Student',
                  text,
                  timestamp: new Date(),
                  isMe: true
                };
                setMessages(prev => [...prev, newMessage]);
              }}
              profileImage={profileImage}
              onPhotoClick={() => setIsModalOpen(true)}
            />
          </motion.div>
        )}

        {view === 'tutor-profile' && (
          <motion.div key="tutor-profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-6 py-10">
            <TutorProfilePage 
              tutorId={selectedTutorId || ''} 
              onBack={handleBack} 
            />
          </motion.div>
        )}

        {view === 'teacher-dashboard' && (
          <motion.div key="teacher" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-6 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Sidebar Navigation */}
              <aside className="lg:col-span-3 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-8 h-fit">
                <div className="flex items-center gap-4 px-2">
                  <div className="relative group cursor-pointer" onClick={() => setIsModalOpen(true)}>
                    <div className="w-12 h-12 rounded-xl bg-slate-200 overflow-hidden">
                      <img src={profileImage} className="w-full h-full object-cover" alt="Profile" />
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Teacher Account</p>
                    <h3 className="font-bold text-slate-800">{profileData.name}</h3>
                  </div>
                </div>

                <nav className="space-y-1">
                  {[
                    { id: 'profile', label: 'My Profile', icon: <User className="w-4 h-4" /> },
                    { id: 'schedule', label: 'Schedule', icon: <Calendar className="w-4 h-4" /> },
                    { id: 'messages', label: 'Messages', icon: <MessageSquare className="w-4 h-4" />, badge: 1 },
                    { id: 'earnings', label: 'Earnings', icon: <DollarSign className="w-4 h-4" /> },
                    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
                  ].map((item) => (
                    <button 
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === item.id ? 'bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-50/50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        {item.label}
                      </div>
                      {item.badge && (
                        <span className="bg-indigo-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full ring-2 ring-white">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>

                <div className="pt-6 border-t border-slate-100">
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Status</p>
                    <div className="flex items-center gap-2 text-sm font-bold text-emerald-700">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      Online & Accepting Students
                    </div>
                  </div>
                </div>
              </aside>

              {/* Main Content Area */}
              <div className="lg:col-span-9 space-y-10">
                {activeTab === 'profile' ? (
                  <div className="flex flex-col gap-8">
                    {/* Profile Section Content (Previously written) */}
                    <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600" />
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Tutor Profile Settings</h2>
                          <p className="text-xs text-slate-400 font-medium">Your changes are reflected live in the preview below.</p>
                        </div>
                        <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all text-xs uppercase tracking-widest transform active:scale-95">
                          Save Changes
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                          <input name="name" type="text" value={profileData.name} onChange={handleInputChange} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-semibold" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Primary Subject</label>
                          <input name="subject" type="text" value={profileData.subject} onChange={handleInputChange} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-semibold" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Location</label>
                          <input name="location" type="text" value={profileData.location} onChange={handleInputChange} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-semibold" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Monthly Fee (USD)</label>
                          <input name="monthlyFee" type="number" value={profileData.monthlyFee} onChange={handleInputChange} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-semibold" />
                        </div>
                      </div>
                    </section>

                    {/* Card Preview */}
                    <div className="w-full bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-2xl shadow-indigo-100">
                      <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="w-32 h-32 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner flex-shrink-0">
                          <img src={profileImage} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 w-full flex flex-col">
                          <div className="flex flex-col md:flex-row justify-between items-start text-center md:text-left gap-4">
                            <div className="space-y-1">
                              <h4 className="text-3xl font-black text-slate-900 tracking-tight leading-none">{profileData.name}</h4>
                              <p className="text-indigo-600 font-black text-sm uppercase tracking-wider">{profileData.subject}</p>
                            </div>
                            <div className="text-center md:text-right">
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Starting from</p>
                              <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black text-slate-900 tracking-tighter">${profileData.monthlyFee}</span>
                                <span className="text-xs text-slate-400 font-bold">/mo</span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                               <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                                  <MapPin className="w-4 h-4 text-slate-300" />
                                  {profileData.location}
                               </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : activeTab === 'messages' ? (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 tracking-tight">Student Inbox</h2>
                      <p className="text-xs text-slate-400 font-medium">Manage your conversations with active students.</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      <div className="lg:col-span-1 space-y-2">
                        <button className="w-full p-4 rounded-3xl flex items-center gap-3 transition-all bg-white shadow-sm border border-slate-200">
                          <img src={MOCK_CONTACTS[2].avatar} className="w-10 h-10 rounded-xl object-cover" />
                          <div className="text-left">
                            <p className="text-sm font-bold text-slate-800">Alex Student</p>
                            <p className="text-[10px] text-emerald-600 font-bold">Online</p>
                          </div>
                        </button>
                      </div>
                      <div className="lg:col-span-3">
                        <ChatInterface 
                          contact={MOCK_CONTACTS[2]}
                          messages={messages.map(m => ({ ...m, isMe: !m.isMe }))}
                          onSendMessage={(text) => {
                            const newMessage: Message = {
                              id: Date.now().toString(),
                              senderId: 'me',
                              senderName: profileData.name,
                              text,
                              timestamp: new Date(),
                              isMe: true
                            };
                            setMessages(prev => [...prev, newMessage]);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-white rounded-3xl border border-slate-200">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                       <LayoutDashboard className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Section Under Construction</h3>
                    <p className="text-slate-400 max-w-xs mx-auto">We're working on this feature. Please check back later!</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative bg-white rounded-[2.5rem] w-full max-sm overflow-hidden shadow-2xl p-10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Change Photo</h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-slate-400"><X className="w-6 h-6" /></button>
                </div>
                <div className="space-y-8">
                  <div onClick={() => fileInputRef.current?.click()} className={`aspect-square rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${previewImage ? 'border-indigo-500' : 'border-slate-200 hover:border-indigo-400'}`}>
                    {previewImage ? <img src={previewImage} className="w-full h-full object-cover" /> : <div className="text-center"><Upload className="w-8 h-8 text-indigo-500 mx-auto mb-4" /><p className="text-sm font-bold">Click to upload</p></div>}
                  </div>
                  <input type="file" className="hidden" ref={fileInputRef} accept="image/*" onChange={handleFileChange} />
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setIsModalOpen(false)} className="py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl text-[10px] uppercase tracking-widest">Cancel</button>
                    <button onClick={saveProfileImage} disabled={!previewImage} className="py-4 bg-indigo-600 text-white font-bold rounded-2xl text-[10px] uppercase tracking-widest disabled:opacity-50">Upload Now</button>
                  </div>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>
    </div>
  );
}
