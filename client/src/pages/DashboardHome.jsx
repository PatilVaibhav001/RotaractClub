import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Users, FileText, Calendar, Activity } from 'lucide-react';

const DashboardHome = () => {
  const { user } = useContext(AuthContext);

  const stats = [
    { label: 'Total Events', value: '12', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Active Members', value: '48', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Reports Generated', value: '24', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'System Status', value: 'Online', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back, Admin</h1>
          <p className="text-slate-500 mt-1">Here's what's happening with your club today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 flex items-center gap-4 transition-all hover:border-blue-200 hover:shadow-md">
              <div className={`p-4 rounded-xl ${stat.bg}`}>
                <Icon size={24} className={stat.color} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-white border border-slate-200 shadow-sm rounded-2xl p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Activity</h2>
        <div className="text-slate-500 text-sm py-12 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          No recent activity to display.
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
