import React, { useContext } from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, FileText, Users, LogOut, Building, UserCircle, FilePlus } from 'lucide-react';
import logo from '../assets/rotaractlogo.png';
import NotificationBell from '../components/NotificationBell';

const DashboardLayout = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (location.pathname === '/dashboard' && user.role !== 'Admin') {
    return <Navigate to="/dashboard/reports" replace />;
  }

  const navItems = [
    { name: 'Analytics', path: '/dashboard', icon: LayoutDashboard, roles: ['Admin'] },
    { name: 'Events', path: '/dashboard/reports', icon: FileText, roles: ['Admin', 'Adminmember', 'Member'] },
    { name: 'Add Event', path: '/dashboard/add-event', icon: FilePlus, roles: ['Admin', 'Adminmember'] },
    { name: 'Clubs', path: '/dashboard/clubs', icon: Building, roles: ['Admin'] },
    { name: 'Members', path: '/dashboard/users', icon: Users, roles: ['Admin'] },
  ].filter(item => item.roles.includes(user.role));

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900">
      {/* Top Navbar */}
      <header className="h-[70px] bg-white border-b border-slate-200 px-10 md:px-16 flex items-center justify-between z-20 flex-shrink-0 shadow-sm">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Rotaract Logo" className="h-10 w-auto" />
        </Link>
        <div className="flex items-center gap-6">
          {user?.role === 'Admin' && <NotificationBell />}
          <div className="text-slate-700 font-medium text-lg">
            Welcome, {user?.name || 'Member'}
          </div>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col transition-all shadow-sm z-10 overflow-y-auto">
          <div className="py-8 flex flex-col items-center border-b border-slate-100">
             <Link to="/dashboard/profile" className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-3 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer group overflow-hidden border border-slate-200">
               {user?.profilePicture ? (
                 <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
               ) : (
                 <UserCircle size={32} className="group-hover:scale-110 transition-transform" />
               )}
             </Link>
             <h2 className="text-sm font-semibold text-slate-800">{user?.name || 'Member'}</h2>
          </div>

          <div className="flex-1 py-6 flex flex-col gap-2 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 font-medium border-l-4 border-blue-600 shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600 border-l-4 border-transparent'
                  }`}
                >
                  <Icon size={20} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="p-4 border-t border-slate-200 bg-slate-50/50">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all font-medium cursor-pointer"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-8 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
