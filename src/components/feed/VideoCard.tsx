import { Heart, MessageCircle, Share2, Music2, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/src/lib/utils';

interface VideoCardProps {
  video: {
    id: string;
    videoUrl: string;
    creatorName: string;
    caption: string;
    likes: number;
    comments: number;
    musicName: string;
    category: string;
  };
  isActive: boolean;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [liked, setLiked] = useState(false);
  const [showHeartAnim, setShowHeartAnim] = useState(false);

  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Handle autoplay blocking
        console.log("Autoplay blocked");
      });
    } else if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isActive]);

  const handleDoubleTap = () => {
    setLiked(true);
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 800);
  };

  return (
    <div 
      className="relative h-full w-full snap-start bg-black flex items-center justify-center overflow-hidden"
      onDoubleClick={handleDoubleTap}
    >
      <video
        ref={videoRef}
        src={video.videoUrl}
        className="h-full w-full object-cover"
        loop
        playsInline
        muted={false}
      />

      {/* Overlay - Bottom Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

      {/* Heart Pop Animation */}
      <AnimatePresence>
        {showHeartAnim && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 1 }}
            exit={{ scale: 2, opacity: 0 }}
            className="absolute z-20 text-neon-purple pointer-events-none"
          >
            <Heart size={100} fill="currentColor" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar Actions */}
      <div className="absolute right-4 bottom-32 flex flex-col items-center space-y-6 z-10">
        <div className="relative group cursor-pointer">
          <div className="w-14 h-14 rounded-full border-2 border-neon-purple p-0.5 overflow-hidden shadow-lg transition-transform hover:scale-110">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${video.creatorName}`} alt={video.creatorName} className="w-full h-full rounded-full" />
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-neon-purple rounded-full p-1 shadow-md">
            <UserPlus size={12} className="text-white" />
          </div>
        </div>

        <button onClick={() => setLiked(!liked)} className="flex flex-col items-center group">
          <div className="p-3 glass rounded-full mb-1 group-active:scale-125 transition-transform">
            <Heart size={28} fill={liked ? "var(--color-neon-purple)" : "transparent"} className={cn(liked ? "text-neon-purple" : "text-white")} />
          </div>
          <span className="text-[10px] font-bold tracking-tight">{video.likes + (liked ? 1 : 0)}</span>
        </button>

        <div className="flex flex-col items-center cursor-pointer group">
          <div className="p-3 glass rounded-full mb-1 group-hover:bg-white/10 transition-colors">
            <MessageCircle size={28} className="text-white" />
          </div>
          <span className="text-[10px] font-bold tracking-tight">{video.comments}</span>
        </div>

        <div className="flex flex-col items-center cursor-pointer group">
          <div className="p-3 glass rounded-full mb-1 group-hover:bg-white/10 transition-colors">
            <Share2 size={28} className="text-white" />
          </div>
          <span className="text-[10px] font-bold tracking-tight uppercase">Share</span>
        </div>
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-10 left-6 right-20 z-10 space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-lg text-white">@{video.creatorName}</h3>
          <span className="px-2 py-0.5 bg-electric-blue rounded text-[10px] font-black uppercase tracking-tighter shadow-sm shrink-0">AI Creator</span>
          <span className="px-2 py-0.5 bg-white/10 border border-white/10 rounded text-[10px] font-bold uppercase tracking-tighter shadow-sm shrink-0">{video.category}</span>
        </div>
        
        <p className="text-sm text-gray-200 line-clamp-2 leading-relaxed max-w-[280px]">
          {video.caption}
        </p>
        
        <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md rounded-full px-4 py-2 border border-white/10 w-fit max-w-full overflow-hidden">
          <Music2 size={16} className="text-electric-blue animate-spin-slow shrink-0" />
          <p className="text-[11px] text-gray-300 italic truncate whitespace-nowrap">
            {video.musicName} • Original Sound
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
