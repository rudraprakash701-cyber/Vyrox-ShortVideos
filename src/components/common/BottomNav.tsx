import { Home, Search, PlusSquare, Bell, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/src/lib/utils';

export default function BottomNav() {
  const items = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/explore' },
    { icon: PlusSquare, label: 'Upload', path: '/upload' },
    { icon: Bell, label: 'Activity', path: '/notifications' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[360px] h-16 glass rounded-full flex items-center justify-around px-4 shadow-2xl z-50">
      {items.map(({ icon: Icon, label, path }, index) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            cn(
              "relative flex flex-col items-center justify-center transition-all duration-300",
              isActive ? "text-neon-purple scale-110" : "text-white/40 hover:text-white"
            )
          }
        >
          {index === 2 ? (
            <div className="w-11 h-9 bg-gradient-to-r from-electric-blue via-neon-purple to-pink-500 rounded-xl flex items-center justify-center shadow-lg transform active:scale-95 transition-transform">
              <Icon size={20} className="text-white" strokeWidth={3} />
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Icon size={24} />
              {/* Active Dot indicator */}
              <span className="h-1 w-1 rounded-full bg-neon-purple mt-1 opacity-0 transition-opacity aria-[current=page]:opacity-100" aria-current={window.location.pathname === path ? 'page' : undefined}></span>
            </div>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
