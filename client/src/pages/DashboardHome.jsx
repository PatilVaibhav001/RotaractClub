import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Users, FileText, Calendar, Activity, Sparkles, Target, TrendingUp, Building } from 'lucide-react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';

const DashboardHome = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/events', {
          headers: { Authorization: `Bearer ${user?.token || JSON.parse(localStorage.getItem('userInfo') || '{}').token}` }
        });
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch events', error);
      }
    };
    fetchEvents();
  }, [user]);

  const totalEvents = events.length;
  
  const analyzedEvents = events.filter(e => e.impactAnalysis && e.impactAnalysis.impactScore);
  const avgImpact = analyzedEvents.length > 0 
    ? Math.round(analyzedEvents.reduce((acc, e) => acc + e.impactAnalysis.impactScore, 0) / analyzedEvents.length) 
    : 'N/A';

  const allSDGs = analyzedEvents.flatMap(e => e.impactAnalysis?.sdgMapped || []);
  const uniqueSDGs = Array.from(new Set(allSDGs.map(s => s.sdg)))
    .map(id => allSDGs.find(s => s.sdg === id));

  // --- CHART DATA PREPARATION ---
  const impactData = analyzedEvents.map(e => ({
    name: e.name.substring(0, 15) + (e.name.length > 15 ? '...' : ''),
    score: e.impactAnalysis.impactScore || 0,
    date: new Date(e.date || e.createdAt).toLocaleDateString()
  })).reverse(); // Oldest first for trend line

  const clubCounts = {};
  events.forEach(e => {
    const clubName = e.author?.club || 'Unknown Club';
    clubCounts[clubName] = (clubCounts[clubName] || 0) + 1;
  });
  const clubData = Object.keys(clubCounts).map(key => ({
    name: key,
    value: clubCounts[key]
  }));
  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

  const volsBenfsData = events.slice(0, 7).map(e => ({
    name: e.name.substring(0, 10) + '...',
    volunteers: e.volunteers || 0,
    beneficiaries: e.beneficiaries || 0
  }));
  // ------------------------------

  const stats = [
    { label: 'Total Events', value: totalEvents, icon: Calendar, bg: 'bg-gradient-to-br from-blue-600 to-blue-800' },
    { label: 'Avg AI Impact Score', value: avgImpact, icon: Sparkles, bg: 'bg-gradient-to-br from-indigo-600 to-purple-800' },
    { label: 'AI Reports Generated', value: analyzedEvents.length, icon: FileText, bg: 'bg-gradient-to-br from-fuchsia-600 to-pink-800' },
    { label: 'System Status', value: 'Online', icon: Activity, bg: 'bg-gradient-to-br from-emerald-500 to-teal-700' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back, {user?.name || 'Admin'}</h1>
          <p className="text-slate-500 mt-1">Here's the global impact of your club's projects.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className={`${stat.bg} shadow-xl shadow-indigo-200/40 rounded-2xl p-6 flex items-center gap-5 transition-transform hover:-translate-y-1`}>
              <div className="p-4 rounded-xl bg-white/20 text-white backdrop-blur-sm">
                <Icon size={28} />
              </div>
              <div>
                <p className="text-sm text-white/80 font-medium mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        
        {/* Line Chart: Impact Over Time */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <TrendingUp className="text-indigo-500" size={20} /> AI Impact Score Trend
          </h2>
          <div className="h-72 w-full">
            {impactData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={impactData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} domain={[0, 100]} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="score" name="Impact Score" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
               <div className="h-full flex items-center justify-center text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-xl">Generate AI reports to see impact trends</div>
            )}
          </div>
        </div>

        {/* Bar Chart: Vols vs Benfs */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Users className="text-emerald-500" size={20} /> Community Reach (Last 7 Events)
          </h2>
          <div className="h-72 w-full">
            {volsBenfsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={volsBenfsData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <RechartsTooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                  <Bar dataKey="volunteers" name="Volunteers" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="beneficiaries" name="Beneficiaries" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
               <div className="h-full flex items-center justify-center text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-xl">Add events to see reach</div>
            )}
          </div>
        </div>

        {/* Pie Chart: Club Distribution */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 lg:col-span-2 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 w-full">
             <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
               <Building className="text-purple-500" size={20} /> Club Activity Distribution
             </h2>
             <p className="text-sm text-slate-500 mb-6">A breakdown of the total number of events hosted by each Rotaract club in the district.</p>
             {/* Map the Clubs below */}
             {clubData.length > 0 ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                 {clubData.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                       <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                          <span className="text-sm font-medium text-slate-700 line-clamp-1">{entry.name}</span>
                       </div>
                       <span className="text-sm font-bold text-slate-900 shrink-0 ml-2">{entry.value}</span>
                    </div>
                 ))}
               </div>
             ) : (
                <div className="py-12 flex items-center justify-center text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-xl">Add events to see club distribution</div>
             )}
          </div>
          <div className="h-64 w-full md:w-64 shrink-0 relative flex items-center justify-center">
            {clubData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={clubData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {clubData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
               <div className="w-48 h-48 rounded-full border-4 border-dashed border-slate-200 flex items-center justify-center">
                 <Building size={32} className="text-slate-300" />
               </div>
            )}
            {/* Center Text for Donut */}
            {clubData.length > 0 && (
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-3xl font-bold text-slate-800">{totalEvents}</span>
                 <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Events</span>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
