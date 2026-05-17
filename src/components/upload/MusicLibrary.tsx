import React, { useState } from 'react';
import { Music as MusicIcon, Play, Pause, Check, Search } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  coverUrl: string;
  duration: number;
}

const DUMMY_MUSIC: Track[] = [
  { id: '1', title: 'Neon Nights', artist: 'CyberWave', url: '#', coverUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=neon', duration: 180 },
  { id: '2', title: 'Electric Pulse', artist: 'Volt Rider', url: '#', coverUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=pulse', duration: 145 },
  { id: '3', title: 'Midnight Synth', artist: 'Vortex', url: '#', coverUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=synth', duration: 210 },
  { id: '4', title: 'Cyber City', artist: 'Glitch Mob', url: '#', coverUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=city', duration: 160 },
  { id: '5', title: 'Future Echo', artist: 'Reverb King', url: '#', coverUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=echo', duration: 195 },
];

export default function MusicLibrary({ onSelect }: { onSelect: (track: Track) => void }) {
  const [search, setSearch] = useState('');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredMusic = DUMMY_MUSIC.filter(m => 
    m.title.toLowerCase().includes(search.toLowerCase()) || 
    m.artist.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (track: Track) => {
    setSelectedId(track.id);
    onSelect(track);
  };

  return (
    <div className="flex flex-col h-full bg-cyber-black text-white p-6 pb-24">
      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-neon-purple/20 rounded-lg">
            <MusicIcon className="text-neon-purple" size={20} />
          </div>
          <h2 className="text-xl font-black italic tracking-wider">VYROX AUDIO LIB</h2>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search for sounds..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-10 text-sm focus:outline-none focus:border-neon-purple transition-all"
          />
          <Search className="absolute left-3 top-3.5 w-4 h-4 text-white/40" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
        {filteredMusic.map((track) => (
          <div
            key={track.id}
            onClick={() => handleSelect(track)}
            className={cn(
              "p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-4",
              selectedId === track.id
                ? "bg-neon-purple/10 border-neon-purple shadow-[0_0_15px_rgba(147,51,234,0.2)]"
                : "bg-white/5 border-white/5 hover:bg-white/10"
            )}
          >
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
              <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPlayingId(playingId === track.id ? null : track.id);
                }}
                className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity"
              >
                {playingId === track.id ? <Pause size={20} /> : <Play size={20} />}
              </button>
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm truncate">{track.title}</h4>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-medium">{track.artist}</p>
            </div>

            {selectedId === track.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-6 h-6 bg-neon-purple rounded-full flex items-center justify-center shadow-lg"
              >
                <Check size={14} strokeWidth={3} />
              </motion.div>
            )}
            
            <span className="text-[10px] text-white/40 font-mono">
              {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
            </span>
          </div>
        ))}

        {filteredMusic.length === 0 && (
          <div className="py-10 text-center text-white/20 text-sm font-display">
            NO_AUDIO_DATA_FOUND
          </div>
        )}
      </div>
    </div>
  );
}
