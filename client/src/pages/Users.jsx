import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Shield, ShieldAlert } from 'lucide-react';

const Users = () => {
  const { user } = useContext(AuthContext);
  const [usersList, setUsersList] = useState([]);
  const [clubsList, setClubsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClub, setSelectedClub] = useState('');

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${user?.token || localStorage.getItem('token')}` }
      });
      setUsersList(data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    const fetchClubs = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/clubs');
        setClubsList(data);
      } catch (error) {
        console.error('Failed to fetch clubs', error);
      }
    };
    fetchClubs();
  }, [user]);

  const handleMakeAdmin = async (userId) => {
    if (!window.confirm('Are you sure you want to make this user an Admin for their club?')) return;
    try {
      await axios.put(`http://localhost:5000/api/users/${userId}/make-admin`, {}, {
        headers: { Authorization: `Bearer ${user?.token || localStorage.getItem('token')}` }
      });
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error('Error making admin', error);
      alert('Failed to upgrade user role.');
    }
  };

  const filteredUsers = usersList.filter(u => {
    const matchesName = (u.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClub = selectedClub ? u.club === selectedClub : true;
    return matchesName && matchesClub;
  });

  if (isLoading) return <div className="p-8 text-slate-500">Loading users...</div>;

  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Members Directory</h2>
        <p className="text-slate-500 mt-1">Manage all registered users and assign admin roles.</p>
      </div>
      
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
        <input 
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
        />
        <select
          value={selectedClub}
          onChange={(e) => setSelectedClub(e.target.value)}
          className="w-full md:w-64 px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm appearance-none"
        >
          <option value="">All Clubs</option>
          {clubsList.map(c => (
             <option key={c._id} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-slate-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 text-sm text-slate-500">
              <th className="py-4 px-6 font-medium">Name & Email</th>
              <th className="py-4 px-6 font-medium">Club</th>
              <th className="py-4 px-6 font-medium">Role</th>
              <th className="py-4 px-6 font-medium">Status</th>
              <th className="py-4 px-6 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u._id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-6">
                  <div className="font-medium text-slate-800">{u.name || 'N/A'}</div>
                  <div className="text-xs text-slate-500">{u.email}</div>
                </td>
                <td className="py-4 px-6 text-sm text-slate-600">{u.club || 'N/A'}</td>
                <td className="py-4 px-6">
                  {u.role === 'Admin' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                      <Shield size={12} /> Admin
                    </span>
                  ) : u.role === 'Adminmember' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      <Shield size={12} /> Club Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                      Member
                    </span>
                  )}
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    u.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                    u.status === 'Pending' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {u.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  {u.role === 'Member' && u.status === 'Approved' && (
                    <button
                      onClick={() => handleMakeAdmin(u._id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                    >
                      <ShieldAlert size={14} /> Make Admin
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="5" className="py-8 text-center text-slate-500">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
