import { useState } from 'react';
import { Sparkles, Send, Loader2, Music } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useNavigate } from 'react-router-dom';

export default function AICaptionGenerator({ selectedMusic }: { selectedMusic?: any }) {
  const [description, setDescription] = useState('');
  const [result, setResult] = useState<{ caption: string; hashtags: string[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const generateMetadata = async () => {
    if (!description) return;
    setLoading(true);
    try {
      const body = { 
        description,
        musicContext: selectedMusic ? `${selectedMusic.title} by ${selectedMusic.artist}` : ''
      };
      const response = await fetch('/api/ai/generate-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Sparkles className="text-neon-purple" />
          AI Creator Tools
        </h2>
        <p className="text-white/60 text-sm">Tell us what's in your video and let Vyrox AI handle the rest.</p>
      </div>

      <div className="space-y-4">
        <div 
          onClick={() => navigate('/music')}
          className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neon-purple/20 rounded-xl flex items-center justify-center">
              <Music size={20} className="text-neon-purple" />
            </div>
            <div>
              <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Background Music</p>
              <p className="text-sm font-bold truncate max-w-[150px]">
                {selectedMusic ? `${selectedMusic.title}` : 'Select track...'}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-black text-neon-purple uppercase">Change</span>
        </div>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. A neon-lit street race in a rainy futuristic city..."
          className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-neon-purple transition-colors resize-none font-sans"
        />
        
        <button
          onClick={generateMetadata}
          disabled={loading || !description}
          className="w-full py-4 bg-gradient-to-r from-neon-purple to-electric-blue rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 neon-glow"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <Sparkles size={18} />
              Generate Magic
            </>
          )}
        </button>
      </div>


      {result && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Generated Caption</label>
            <p className="text-sm italic">"{result.caption}"</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.hashtags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-neon-purple/20 border border-neon-purple/30 rounded-full text-xs font-medium text-neon-purple">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
