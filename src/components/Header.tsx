import { Search, Bell } from 'lucide-react';
import { GymSettings } from '../types';

interface HeaderProps {
  gymSettings: GymSettings;
  searchVal: string;
  setSearchVal: (val: string) => void;
  onNotificationClick: () => void;
}

export default function Header({ 
  gymSettings, 
  searchVal, 
  setSearchVal,
  onNotificationClick 
}: HeaderProps) {
  return (
    <header id="header-container" className="h-[76px] bg-[#FAF7F2] border-b border-[#EFE9E4] flex items-center justify-between px-8 sticky top-0 z-10">
      {/* Search Bar */}
      <div className="relative w-full max-w-lg">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </span>
        <input
          type="text"
          id="global-search-input"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          placeholder="Buscar miembros, pagos, rutinas, entrenadores..."
          className="w-full bg-[#FFFFFF] border border-[#EFE9E4] rounded-2xl pl-10 pr-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-[0_1px_3px_rgba(239,233,228,0.2)]"
        />
      </div>

      {/* Profile & Notifications */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button 
          id="notification-bell-btn"
          onClick={onNotificationClick}
          className="relative p-2.5 bg-white border border-[#EFE9E4] rounded-full text-gray-500 hover:text-gray-800 hover:bg-[#F8F4EE] transition-all shadow-[0_1px_3px_rgba(239,233,228,0.2)]"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 border-l border-[#EFE9E4] pl-4">
          <div className="text-right">
            <h3 className="text-sm font-bold text-gray-900 leading-tight">Roberto Martínez</h3>
            <span className="text-[11px] text-gray-400 font-medium mt-0.5 block">
              Owner · {gymSettings.name}
            </span>
          </div>
          <div className="relative">
            <img 
              id="user-profile-avatar"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" // smiling photo or owner photo
              alt="Roberto Martínez"
              className="w-10 h-10 rounded-full border border-[#EFE9E4] object-cover"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
        </div>
      </div>
    </header>
  );
}
