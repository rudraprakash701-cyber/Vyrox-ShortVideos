import { motion, AnimatePresence } from 'motion/react';
import { signInWithGoogle } from '../../lib/firebase';
import { LogIn, Sparkles, X } from 'lucide-react';
import { useState } from 'react';

interface AuthOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthOverlay({ isOpen, onClose }: AuthOverlayProps) {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-md bg-gradient-to-br from-[#121214] to-[#1a1a1f] border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-neon-purple to-electric-blue rounded-3xl flex items-center justify-center neon-glow mb-6">
                <span className="text-3xl font-black italic">VX</span>
              </div>
              
              <h2 className="text-3xl font-black italic tracking-tighter mb-2">JOIN THE FUTURE</h2>
              <p className="text-gray-400 text-sm mb-10 max-w-[280px]">
                Connect your account to save videos, track trends, and unlock AI insights.
              </p>

              <div className="w-full space-y-4">
                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full bg-white text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-all disabled:opacity-50"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/layout/google.svg" className="w-5 h-5" alt="Google" />
                  {loading ? 'Authenticating...' : 'Continue with Google'}
                </button>
                
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                  By continuing, you agree to Vyrox Protocol v1.0
                </p>
              </div>

              <div className="mt-12 flex items-center gap-2 text-electric-blue">
                <Sparkles size={16} />
                <span className="text-[10px] font-black tracking-[0.2em] uppercase">Powered by Gemini Pro</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
