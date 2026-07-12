import { 
  LayoutDashboard, 
  Users, 
  Dumbbell, 
  Sparkles, 
  FileText, 
  CreditCard, 
  Settings, 
  HelpCircle, 
  LogOut,
  MapPin,
  Flame
} from 'lucide-react';
import { GymSettings } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  gymSettings: GymSettings;
  riskCount: number;
  onLogout: () => void;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  gymSettings, 
  riskCount,
  onLogout 
}: SidebarProps) {
  
  const menuGroups = [
    {
      title: "OPERACIÓN",
      items: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "miembros", label: "Miembros", icon: Users, badge: riskCount },
        { id: "rutinas", label: "Rutinas", icon: Dumbbell },
        { id: "entrenadores", label: "Entrenadores", icon: Users }, // Replaced with user icon as seen
      ]
    },
    {
      title: "NEGOCIO",
      items: [
        { id: "reportes", label: "Reportes", icon: FileText },
        { id: "pagos", label: "Pagos", icon: CreditCard },
      ]
    },
    {
      title: "GENERAL",
      items: [
        { id: "configuracion", label: "Configuración", icon: Settings },
        { id: "ayuda", label: "Ayuda", icon: HelpCircle },
      ]
    }
  ];

  return (
    <aside id="sidebar-container" className="w-[260px] min-w-[260px] bg-[#FAF7F2] border-r border-[#EFE9E4] flex flex-col justify-between h-screen sticky top-0 text-gray-800">
      <div className="flex flex-col p-5 overflow-y-auto flex-grow gap-6">
        {/* Logo and Slogan */}
        <div className="flex items-start gap-3 mt-1 px-1">
          <div className="p-2 bg-[#1E1E1E] text-white rounded-xl flex items-center justify-center">
            <Flame className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-[#1E1E1E] leading-tight">
              TitanOps
            </h1>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 block -mt-0.5">
              Gym Management Platform
            </span>
          </div>
        </div>

        {/* Gym Location Card */}
        <div className="bg-[#FFFFFF] border border-[#EFE9E4] rounded-2xl p-4 shadow-[0_2px_8px_rgba(239,233,228,0.3)]">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
            GIMNASIO
          </span>
          <h2 className="text-base font-bold text-gray-900 mt-1 truncate">
            {gymSettings.name}
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
            <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span className="truncate">{gymSettings.location}</span>
          </div>
        </div>

        {/* Navigation Menus */}
        <nav className="flex flex-col gap-5">
          {menuGroups.map((group) => (
            <div key={group.title} className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-gray-400 tracking-wider px-3 mb-1">
                {group.title}
              </span>
              <ul className="flex flex-col gap-1">
                {group.items.map((item) => {
                  const isActive = activeTab === item.id;
                  const IconComponent = item.icon;
                  return (
                    <li key={item.id}>
                      <button
                        id={`nav-item-${item.id}`}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                          isActive 
                            ? 'bg-[#F3ECE5] text-gray-950 font-semibold shadow-[0_1px_3px_rgba(30,30,30,0.05)]' 
                            : 'text-gray-500 hover:bg-[#F8F4EE] hover:text-gray-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <IconComponent className={`w-4 h-4 ${isActive ? 'text-gray-950' : 'text-gray-400'}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className="bg-orange-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* Active Session card - Bottom Left */}
      <div className="p-4 border-t border-[#EFE9E4] bg-[#FAF7F2]">
        <div className="bg-[#1E2229] rounded-2xl p-4 text-white flex flex-col gap-3 shadow-lg">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 bg-gray-800 rounded-lg text-emerald-400 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-200">Sesión activa</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">Vas a volver al inicio.</p>
            </div>
          </div>
          <button 
            id="logout-button"
            onClick={onLogout}
            className="flex items-center justify-center gap-1.5 w-full bg-gray-800 hover:bg-gray-700 text-xs font-medium py-2 px-3 rounded-xl text-gray-300 hover:text-white transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
