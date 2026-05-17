import React, { useState } from 'react';
import VideoCard from './VideoCard';
import { cn } from '@/src/lib/utils';

const CATEGORIES = ['All', 'Gaming', 'Music', 'Tech', 'Comedy', 'Cyberpunk', 'lo-fi'];

const DUMMY_VIDEOS = [
  {
    id: '1',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-lighting-styles-34440-small.mp4',
    creatorName: 'cyberpunk_ninja',
    caption: 'Neon vibes in the heart of Tokyo. #futuristic #vyrox',
    likes: 12400,
    comments: 420,
    musicName: 'Shadow Walker - NightDrive',
    category: 'Cyberpunk'
  },
  {
    id: '2',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-urban-street-at-night-with-rain-42247-small.mp4',
    creatorName: 'digital_ghost',
    caption: 'Rainy nights and low-fi beats. 🌧️✨',
    likes: 8900,
    comments: 156,
    musicName: 'Lofi Rain - ChillHop',
    category: 'lo-fi'
  },
  {
    id: '3',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-futuristic-lines-at-night-34167-small.mp4',
    creatorName: 'code_visual',
    caption: 'Data streams and digital consciousness. The future is here.',
    likes: 15000,
    comments: 890,
    musicName: 'Circuit Board - TechCore',
    category: 'Tech'
  }
];

export default function VideoFeed() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredVideos = selectedCategory === 'All' 
    ? DUMMY_VIDEOS 
    : DUMMY_VIDEOS.filter(v => v.category === selectedCategory);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollPos = e.currentTarget.scrollTop;
    const height = e.currentTarget.clientHeight;
    const index = Math.round(scrollPos / height);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  return (
    <div className="relative h-screen w-full bg-black">
      {/* Category Picker */}
      <div className="absolute top-4 left-0 right-0 z-40 px-4 overflow-x-auto scrollbar-hide flex items-center space-x-2 pb-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setActiveIndex(0);
            }}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border",
              selectedCategory === cat 
                ? "bg-neon-purple border-neon-purple text-white neon-glow shadow-sm" 
                : "bg-black/40 border-white/10 text-white/60 hover:text-white"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div 
        className="h-full w-full overflow-y-scroll snap-y-mandatory scrollbar-hide"
        onScroll={handleScroll}
      >
        {filteredVideos.length > 0 ? (
          filteredVideos.map((video, index) => (
            <VideoCard 
              key={video.id} 
              video={video} 
              isActive={index === activeIndex} 
            />
          ))
        ) : (
          <div className="h-full flex items-center justify-center text-white/40 font-display">
            NO_VIDEOS_FOUND
          </div>
        )}
      </div>
    </div>
  );
}
