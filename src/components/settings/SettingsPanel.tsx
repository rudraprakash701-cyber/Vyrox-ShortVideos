import { motion, AnimatePresence } from 'motion/react';
import { X, User, Shield, Bell, Moon, LogOut, ChevronRight, Share2, Download } from 'lucide-react';
import { logout } from '../../lib/firebase';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export default function SettingsPanel({ isOpen, onClose, user }: SettingsPanelProps) {
  const handleLogout = async () => {
    await logout();
    onClose();
  };

  const sections = [
    { title: 'Account', icon: User, items: ['Edit Profile', 'Privacy', 'Language'] },
    { title: 'Preferences', icon: Moon, items: ['Dark Mode', 'Auto-play', 'Content Filtering'] },
    { title: 'Security', icon: Shield, items: ['Two-Factor Auth', 'Login Activity', 'Manage Devices'] },
    { title: 'App', icon: Download, items: ['Clear Cache', 'Check for Updates', 'About Version 1.0'] }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex md:justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-full max-w-md h-full bg-[#121214] border-l border-white/5 relative flex flex-col"
          >
            <div className="h-20 flex items-center justify-between px-8 border-b border-white/5 shrink-0">
              <h2 className="text-xl font-black italic tracking-tighter">SETTINGS</h2>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* User Identity */}
              <div className="bg-gradient-to-br from-neon-purple/20 to-electric-blue/20 rounded-3xl p-6 border border-white/10 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-neon-purple p-0.5 shrink-0">
                  <img src={user?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=vy'} alt="Avatar" />
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-bold text-lg truncate">{user?.displayName || 'Vyrox User'}</h3>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
              </div>

              {/* Sections */}
              {sections.map((section, idx) => (
                <div key={idx} className="space-y-4">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2 flex items-center gap-2">
                    <section.icon size={12} />
                    {section.title}
                  </label>
                  <div className="space-y-1">
                    {section.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between px-4 py-4 hover:bg-white/5 rounded-2xl transition-colors group cursor-pointer">
                        <span className="text-sm font-medium text-gray-300 group-hover:text-white">{item}</span>
                        <ChevronRight size={16} className="text-gray-600 group-hover:text-white" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="pt-8">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold hover:bg-red-500/20 transition-all"
                >
                  <LogOut size={20} />
                  Sign Out
                </button>
              </div>
            </div>

            <div className="p-8 border-t border-white/5 bg-black/40">
              <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                <span>VYROX OS v1.0.4</span>
                <span className="text-electric-blue">Sync: Live</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
