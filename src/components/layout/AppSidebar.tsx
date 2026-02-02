import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BoxIcon,
  RotateCcw,
  CreditCard,
  Users,
  Bell,
  BarChart3,
  ListTodo,
  Globe,
  MessageSquare,
  LogOut,
  ChevronDown,
  Warehouse,
  Settings,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
  roles: UserRole[];
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navigationGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'vendor', 'operations'] },
    ],
  },
  {
    label: 'Management',
    items: [
      { title: 'Products', url: '/products', icon: Package, roles: ['admin', 'vendor'] },
      { title: 'Inventory', url: '/inventory', icon: BoxIcon, roles: ['admin', 'vendor', 'operations'] },
      { title: 'Orders', url: '/orders', icon: ShoppingCart, roles: ['admin', 'vendor', 'operations'] },
      { title: 'Returns & Claims', url: '/returns', icon: RotateCcw, roles: ['admin', 'operations'] },
    ],
  },
  {
    label: 'Finance',
    items: [
      { title: 'Settlements', url: '/settlements', icon: CreditCard, roles: ['admin', 'vendor'] },
    ],
  },
  {
    label: 'Vendors',
    items: [
      { title: 'Vendor List', url: '/vendors', icon: Users, roles: ['admin'] },
      { title: 'Warehouses', url: '/warehouses', icon: Warehouse, roles: ['admin', 'operations'] },
    ],
  },
  {
    label: 'Operations',
    items: [
      { title: 'Alerts', url: '/alerts', icon: Bell, roles: ['admin', 'vendor', 'operations'] },
      { title: 'Tasks', url: '/tasks', icon: ListTodo, roles: ['admin', 'operations'] },
      { title: 'Analytics', url: '/analytics', icon: BarChart3, roles: ['admin', 'vendor'] },
    ],
  },
  {
    label: 'Channels',
    items: [
      { title: 'E-Commerce Site', url: '/ecommerce', icon: Globe, roles: ['admin', 'vendor'] },
      { title: 'AI Chatbot', url: '/chatbot', icon: MessageSquare, roles: ['admin'] },
    ],
  },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredGroups = navigationGroups.map(group => ({
    ...group,
    items: group.items.filter(item => user && item.roles.includes(user.role)),
  })).filter(group => group.items.length > 0);

  return (
    <Sidebar className="border-r-0" collapsible="icon">
      {/* Header */}
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-sidebar-primary">
            <Package className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-sidebar-foreground">VendorPro</span>
              <span className="text-xs text-sidebar-foreground/60">VMS Platform</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* Navigation Content */}
      <SidebarContent className="px-2 py-4 scrollbar-thin">
        {filteredGroups.map((group) => (
          <SidebarGroup key={group.label}>
            {!isCollapsed && (
              <SidebarGroupLabel className="text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wider px-3 mb-2">
                {group.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = location.pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                      >
                        <a
                          href={item.url}
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(item.url);
                          }}
                          className={`
                            flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                            ${isActive 
                              ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium' 
                              : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                            }
                          `}
                        >
                          <item.icon className="w-4 h-4 shrink-0" />
                          {!isCollapsed && <span>{item.title}</span>}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer - User Menu */}
      <SidebarFooter className="p-3 border-t border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-sidebar-accent transition-colors">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                  {user?.name?.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name}</p>
                    <p className="text-xs text-sidebar-foreground/60 capitalize">{user?.role}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-sidebar-foreground/60" />
                </>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
