import { ReactNode, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, GitCompare, Upload, FileText, Settings, ChevronLeft, CreditCard, Building2, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', to: '/demo', icon: LayoutDashboard, end: true },
  { label: 'Sales Analysis', to: '/demo/sales', icon: TrendingUp },
  { label: 'VMS Reconciliation', to: '/demo/reconciliation', icon: GitCompare },
  { label: 'Data Import', to: '/demo/import', icon: Upload },
  { label: 'Reports', to: '/demo/reports', icon: FileText },
  { label: 'Subscription', to: '/demo/subscription', icon: CreditCard },
  { label: 'Onboarding', to: '/demo/onboarding', icon: Building2 },
  { label: 'Support', to: '/demo/support', icon: MessageSquare },
  { label: 'Settings', to: '/demo/settings', icon: Settings },
];

export default function DemoLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.add('dark');
    return () => { document.documentElement.classList.remove('dark'); };
  }, []);

  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-[#0a0e1a] text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-[#0d1224] flex flex-col">
        <div className="p-5 border-b border-white/10">
          <h1 className="text-lg font-bold tracking-tight text-white">
            🛒 Multi Portal
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">E-Commerce Integration</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                )
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <NavLink
            to="/dashboard"
            className="flex items-center gap-2 px-3 py-2 text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            <ChevronLeft className="w-3 h-3" />
            Back to Main App
          </NavLink>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
