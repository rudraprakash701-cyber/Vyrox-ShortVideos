/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VideoFeed from './components/feed/VideoFeed';
import BottomNav from './components/common/BottomNav';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import ChatPanel from './components/chat/ChatPanel';
import AICaptionGenerator from './components/ai/AICaptionGenerator';
import MusicLibrary from './components/upload/MusicLibrary';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Sparkles, Search, Home, ChevronDown, User as UserIcon, Settings } from 'lucide-react';
import { auth } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import AuthOverlay from './components/auth/AuthOverlay';
import SettingsPanel from './components/settings/SettingsPanel';

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState<any>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // We need to wrap AppContent to use navigate
  return (
    <Router>
      <AppContent 
        isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen}
        isAIOpen={isAIOpen} setIsAIOpen={setIsAIOpen}
        selectedMusic={selectedMusic} setSelectedMusic={setSelectedMusic}
        user={user}
        isAuthOpen={isAuthOpen} setIsAuthOpen={setIsAuthOpen}
        isSettingsOpen={isSettingsOpen} setIsSettingsOpen={setIsSettingsOpen}
      />
    </Router>
  );
}

function AppContent({ 
  isChatOpen, setIsChatOpen, 
  isAIOpen, setIsAIOpen, 
  selectedMusic, setSelectedMusic,
  user,
  isAuthOpen, setIsAuthOpen,
  isSettingsOpen, setIsSettingsOpen
}: any) {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full bg-cyber-black text-white flex flex-col font-sans overflow-hidden">
        {/* TOP NAV - Sleek Interface style */}
        <nav className="h-16 border-b border-white/10 flex items-center justify-between px-4 md:px-8 bg-surface/80 backdrop-blur-xl shrink-0 z-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-neon-purple to-electric-blue rounded-xl flex items-center justify-center neon-glow">
              <span className="text-2xl font-black italic">V</span>
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-gradient italic hidden sm:block">VYROX</h1>
          </div>
          <div className="flex-1 max-w-md mx-4 md:mx-8">
            <div className="relative">
              <input type="text" placeholder="Search creators, sounds..." className="w-full bg-white/5 border border-white/10 rounded-full py-2 px-10 text-sm focus:outline-none focus:border-electric-blue/50 transition-all font-sans" />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            </div>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden md:flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold uppercase tracking-widest">Live</span>
            </div>
            {user ? (
              <button 
                onClick={() => navigate('/upload')}
                className="px-4 py-2 bg-gradient-to-r from-neon-purple to-electric-blue rounded-full text-xs font-bold shadow-lg hover:neon-glow transition-all"
              >
                Upload
              </button>
            ) : (
              <button 
                onClick={() => setIsAuthOpen(true)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-xs font-bold transition-all"
              >
                Login
              </button>
            )}
            
            <div 
              onClick={() => user ? setIsSettingsOpen(true) : setIsAuthOpen(true)}
              className="w-10 h-10 rounded-full border-2 border-neon-purple p-0.5 cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="w-full h-full bg-gray-800 rounded-full overflow-hidden flex items-center justify-center">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Me" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={20} className="text-gray-500" />
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* MAIN GRID */}
        <div className="flex-1 flex md:grid md:grid-cols-[240px_1fr_300px] gap-6 p-4 md:p-6 overflow-hidden relative">
          
          {/* LEFT SIDEBAR - Hidden on mobile */}
          <aside className="hidden md:flex flex-col gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-4">Navigation</label>
              <div className="space-y-1">
                <div className="flex items-center gap-3 px-4 py-3 nav-active-blue rounded-2xl">
                  <Home size={20} />
                  <span className="font-bold">Feed</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-2xl transition-colors text-gray-400 group cursor-pointer">
                  <Search size={20} className="group-hover:text-white" />
                  <span className="font-medium group-hover:text-white">Explore</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-2xl transition-colors text-gray-400 group cursor-pointer">
                  <MessageSquare size={20} className="group-hover:text-white" />
                  <span className="font-medium group-hover:text-white">Messages</span>
                  <span className="ml-auto bg-neon-purple text-[10px] px-1.5 py-0.5 rounded-full text-white">12</span>
                </div>
              </div>
            </div>

            <div className="glass-light rounded-3xl p-5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Suggested</p>
              <div className="space-y-4">
                {['CyberVibe', 'NeoGlow'].map(name => (
                  <div key={name} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} alt={name} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{name}</p>
                      <p className="text-[10px] text-gray-500">2.4M Followers</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* CENTER CONTENT (Mobile Viewport) */}
          <main className="flex-1 relative flex flex-col items-center">
            <div className="w-full max-w-[400px] h-full bg-black md:rounded-[48px] md:border-[8px] md:border-[#1A1A1E] shadow-2xl overflow-hidden relative">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<VideoFeed />} />
                  <Route path="/explore" element={<div className="p-10 text-center font-display">SEARCH_GRID_INIT...</div>} />
                  <Route path="/upload" element={<div className="p-4 overflow-y-auto h-full"><AICaptionGenerator selectedMusic={selectedMusic} /></div>} />
                  <Route path="/music" element={<MusicLibrary onSelect={(t) => { setSelectedMusic(t); navigate('/upload'); }} />} />
                  <Route path="/notifications" element={<div className="p-10 text-center font-display">ACTIVITY_STREAM...</div>} />
                  <Route path="/profile" element={<div className="p-10 text-center font-display">USER_PROTOCOL_V1...</div>} />
                </Routes>
              </AnimatePresence>


              {/* Floating Quick Actions (Mobile) */}
              <div className="absolute right-4 bottom-24 z-40 md:hidden flex flex-col space-y-4">
                <button 
                  onClick={() => setIsChatOpen(true)}
                  className="p-3 glass rounded-full text-white neon-glow"
                >
                  <MessageSquare size={24} />
                </button>
                <button 
                  onClick={() => setIsAIOpen(true)}
                  className="p-3 glass rounded-full text-white blue-glow"
                >
                  <Sparkles size={24} />
                </button>
              </div>
            </div>
            
            <div className="hidden md:flex absolute -bottom-1 items-center gap-2 text-gray-500 text-[10px] font-bold tracking-widest mt-2 uppercase">
              <ChevronDown className="w-3 h-3 animate-bounce" />
              Swipe to explore
            </div>
          </main>

          {/* RIGHT SIDEBAR - Hidden on mobile */}
          <aside className="hidden md:flex flex-col gap-6">
            <div className="bg-gradient-to-br from-[#121214] to-[#1a1a1f] rounded-3xl p-6 border border-white/5 shadow-xl">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-electric-blue/20 rounded-lg flex items-center justify-center border border-electric-blue/30">
                  <Sparkles className="w-4 h-4 text-electric-blue" />
                </div>
                <h3 className="text-sm font-black italic tracking-wider">VYROX AI INSIGHTS</h3>
              </div>
              <div className="space-y-4">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-gray-500 font-bold mb-1 uppercase">Smart Caption Gen</p>
                  <p className="text-xs text-gray-300 italic">"Step into the neon future...✨"</p>
                  <button className="mt-2 text-[10px] font-bold text-electric-blue uppercase tracking-widest">Copy AI Draft</button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-center">
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Trend Score</p>
                    <p className="text-lg font-black text-neon-purple">98%</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-center">
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Engagement</p>
                    <p className="text-lg font-black text-electric-blue">High</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-light rounded-3xl p-6 flex-1">
              <h3 className="text-sm font-black italic tracking-wider mb-6">GLOBAL TRENDS</h3>
              <div className="space-y-5">
                {[
                  { tag: '#MetaVerseLiving', views: '4.2B' },
                  { tag: '#AIArtChallenge', views: '1.8B' },
                  { tag: '#NeonVibesOnly', views: '940M' },
                ].map(trend => (
                  <div key={trend.tag} className="flex justify-between items-center group cursor-pointer">
                    <span className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors">{trend.tag}</span>
                    <span className="text-[10px] text-gray-500 px-2 py-1 bg-white/5 rounded-lg">{trend.views} views</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-12 p-4 bg-gradient-to-r from-electric-blue/20 to-neon-purple/20 rounded-2xl border border-electric-blue/20">
                <p className="text-xs font-bold mb-2 uppercase tracking-wider">Reward Center</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-[10px] text-black font-black">$</div>
                    <span className="text-xl font-black font-display">12,450</span>
                  </div>
                  <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest cursor-pointer hover:underline">Withdraw</span>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Global Overlays */}
        <ChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        <AuthOverlay isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} user={user} />
        
        <AnimatePresence>
          {isAIOpen && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="absolute inset-x-0 bottom-16 h-[70%] z-[70] glass rounded-t-[3rem] overflow-hidden md:max-w-md md:left-1/2 md:-translate-x-1/2"
            >
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mt-4 cursor-pointer" onClick={() => setIsAIOpen(false)} />
              <AICaptionGenerator selectedMusic={selectedMusic} />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Mobile Bottom Nav */}
        <div className="md:hidden">
          <BottomNav />
        </div>

        {/* Splash/Loading Overlay */}
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="fixed inset-0 z-[100] bg-cyber-black flex flex-col items-center justify-center pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center"
          >
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-neon-purple to-electric-blue flex items-center justify-center neon-glow mb-4">
              <span className="text-4xl font-black italic tracking-tighter">VX</span>
            </div>
            <h1 className="text-3xl font-black tracking-[0.2em] italic text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              VYROX
            </h1>
            <p className="text-white/40 text-[10px] mt-2 uppercase tracking-[0.4em]">The Future is Now</p>
          </motion.div>
        </motion.div>
      </div>
    );
}


