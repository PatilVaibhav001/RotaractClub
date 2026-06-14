import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, Building } from 'lucide-react';

const Clubs = () => {
  const { user } = useContext(AuthContext);
  const [clubs, setClubs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newClubName, setNewClubName] = useState('');

  const fetchClubs = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/clubs');
      setClubs(data);
    } catch (error) {
      console.error('Failed to fetch clubs', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const handleAddClub = async (e) => {
    e.preventDefault();
    if (!newClubName.trim()) return;
    try {
      await axios.post('http://localhost:5000/api/clubs', 
        { name: newClubName },
        { headers: { Authorization: `Bearer ${user?.token || localStorage.getItem('token')}` } }
      );
      setNewClubName('');
      setShowAddForm(false);
      fetchClubs();
    } catch (error) {
      console.error('Failed to create club', error);
      alert(error.response?.data?.message || 'Failed to create club');
    }
  };

  const filteredClubs = clubs.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="p-8 text-slate-500">Loading clubs...</div>;

  return (
    <div className="max-w-7xl">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Clubs Directory</h2>
          <p className="text-slate-500 mt-1">Manage the list of registered Rotaract clubs.</p>
        </div>
        {!showAddForm && (
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors text-sm"
          >
            <Plus size={18} /> Add New Club
          </button>
        )}
      </div>

      {showAddForm && (
        <form onSubmit={handleAddClub} className="mb-6 p-6 bg-white rounded-2xl shadow-sm border border-blue-100 flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Club Name</label>
            <input 
              type="text" 
              required
              autoFocus
              placeholder="e.g. Rotaract Club of Downtown"
              value={newClubName}
              onChange={(e) => setNewClubName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button 
              type="button"
              onClick={() => { setShowAddForm(false); setNewClubName(''); }}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex-1"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex-1 whitespace-nowrap"
            >
              Save Club
            </button>
          </div>
        </form>
      )}

      <div className="mb-6">
        <input 
          type="text"
          placeholder="Search clubs by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-96 px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-slate-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 text-sm text-slate-500">
              <th className="py-4 px-6 font-medium">Club Name</th>
              <th className="py-4 px-6 font-medium text-right">Added On</th>
            </tr>
          </thead>
          <tbody>
            {filteredClubs.map((c) => (
              <tr key={c._id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0">
                      <Building size={16} />
                    </div>
                    <span className="font-medium text-slate-800">{c.name}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-slate-500 text-right">
                  {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A'}
                </td>
              </tr>
            ))}
            {filteredClubs.length === 0 && (
              <tr>
                <td colSpan="2" className="py-8 text-center text-slate-500">No clubs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Clubs;
