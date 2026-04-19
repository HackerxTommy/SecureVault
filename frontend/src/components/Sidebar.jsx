import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Shield, 
  Activity, 
  FileText, 
  Settings, 
  LogOut,
  ChevronDown,
  ChevronRight,
  Zap
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Scans', icon: Shield, path: '/scans' },
  { name: 'Reports', icon: FileText, path: '/reports' },
  { name: 'Activity', icon: Activity, path: '/activity' },
  { name: 'Settings', icon: Settings, path: '/settings' },
];

export default function Sidebar({ isOpen, onToggle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (name) => {
    setExpandedItems(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  return (
    <aside className={`
      fixed left-0 top-0 h-screen bg-dark-900/95 backdrop-blur-xl 
      border-r border-white/5 z-50
      transition-all duration-300 ease-in-out
      ${isOpen ? 'w-72' : 'w-20'}
    `}>
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center shadow-glow">
              <Shield className="w-7 h-7 text-white" />
            </div>
            {isOpen && (
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">SecureVault</h1>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <p className="text-xs text-dark-300 font-medium">System Active</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto scrollbar-hide">
          <div className="mb-4 px-4">
            <span className="text-xs font-semibold text-dark-400 uppercase tracking-wider">Menu</span>
          </div>
          
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={`
                  group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                  ${isActive 
                    ? 'bg-brand-500/10 text-brand-300 border border-brand-500/20 shadow-glow-sm' 
                    : 'text-dark-300 hover:bg-dark-800/50 hover:text-dark-50 border border-transparent'
                  }
                `}
              >
                <div className={`
                  p-2 rounded-lg transition-all duration-300
                  ${isActive ? 'bg-brand-500/20' : 'bg-dark-800 group-hover:bg-dark-700'}
                `}>
                  <item.icon className={`
                    w-5 h-5 flex-shrink-0 transition-colors
                    ${isActive ? 'text-brand-400' : 'text-dark-400 group-hover:text-dark-200'}
                  `} />
                </div>
                {isOpen && (
                  <>
                    <span className="flex-1 font-semibold">{item.name}</span>
                    {isActive && (
                      <div className="w-2 h-2 bg-brand-400 rounded-full shadow-glow-sm" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Pro Banner */}
        {isOpen && (
          <div className="px-4 mb-4">
            <div className="p-4 bg-gradient-to-br from-brand-600/20 to-brand-900/20 rounded-2xl border border-brand-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-brand-400" />
                <span className="text-sm font-semibold text-white">Pro Plan</span>
              </div>
              <p className="text-xs text-dark-300 mb-3">Unlock advanced features</p>
              <button className="w-full py-2 bg-brand-600 hover:bg-brand-500 rounded-lg text-xs font-semibold text-white transition-colors">
                Upgrade Now
              </button>
            </div>
          </div>
        )}

        {/* Logout */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={() => {
              logout();
              navigate('/auth');
            }}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-dark-300 hover:bg-dark-800/50 hover:text-red-400 transition-all duration-200 group"
          >
            <div className="p-2 rounded-lg bg-dark-800 group-hover:bg-red-500/10 transition-colors">
              <LogOut className="w-5 h-5 flex-shrink-0" />
            </div>
            {isOpen && <span className="font-semibold">Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
