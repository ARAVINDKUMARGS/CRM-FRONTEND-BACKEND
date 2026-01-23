import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import {
  LayoutDashboard,
  Users,
  UserCircle,
  Building2,
  TrendingUp,
  CheckSquare,
  Phone,
  Megaphone,
  BarChart3,
  Settings,
  ShieldCheck,
  Bell,
  Menu,
  X,
  LogOut,
  Sparkles
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, hasPermission } = useAuth();
  const { unreadCount } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', module: 'dashboard' },
    { icon: TrendingUp, label: 'Leads', path: '/leads', module: 'leads' },
    { icon: UserCircle, label: 'Contacts', path: '/contacts', module: 'contacts' },
    { icon: Building2, label: 'Accounts', path: '/accounts', module: 'accounts' },
    { icon: TrendingUp, label: 'Deals', path: '/deals', module: 'deals' },
    { icon: CheckSquare, label: 'Tasks', path: '/tasks', module: 'tasks' },
    { icon: Phone, label: 'Communications', path: '/communications', module: 'communications' },
    { icon: Megaphone, label: 'Campaigns', path: '/campaigns', module: 'campaigns' },
    { icon: BarChart3, label: 'Reports', path: '/reports', module: 'reports' },
    { icon: Users, label: 'Users', path: '/users', module: 'users', adminOnly: true },
    { icon: Settings, label: 'Organization', path: '/organization', module: 'organization', adminOnly: true },
    { icon: ShieldCheck, label: 'Security', path: '/security', module: 'security', adminOnly: true },
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (item.adminOnly && user?.role !== 'System Admin') return false;
    return hasPermission(item.module);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center">
              <Sparkles className="w-8 h-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">CRM Pro</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                {user?.name.charAt(0)}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {filteredMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex-1" />

            <div className="flex items-center space-x-4">
              <Link
                to="/notifications"
                className="relative p-2 text-gray-500 hover:text-gray-700"
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:px-6 lg:px-8 py-8">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
