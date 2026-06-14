import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { UserCircle, Save, UploadCloud } from 'lucide-react';
import { IKContext, IKUpload } from 'imagekitio-react';

const authenticator = async () => {
  try {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const response = await axios.get('http://localhost:5000/api/users/imagekit-auth', {
      headers: { Authorization: `Bearer ${userInfo.token}` }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

const Profile = () => {
  const { user, login } = useContext(AuthContext); // we can update context on save
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
    club: '',
    password: '', // optional
    profilePicture: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [clubsList, setClubsList] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Fetch Clubs
        const { data: clubs } = await axios.get('http://localhost:5000/api/clubs');
        setClubsList(clubs);

        // Fetch Profile
        const { data } = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${user?.token || localStorage.getItem('token')}` }
        });
        setFormData({
          name: data.name || '',
          email: data.email || '',
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
          club: data.club || '',
          password: '',
          profilePicture: data.profilePicture || ''
        });
      } catch (error) {
        console.error('Failed to fetch profile', error);
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const { data } = await axios.put('http://localhost:5000/api/users/profile', formData, {
        headers: { Authorization: `Bearer ${user?.token || localStorage.getItem('token')}` }
      });
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      
      // Update auth context with new data, preserve token
      login({ ...data, token: user?.token || JSON.parse(localStorage.getItem('userInfo') || '{}').token });
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Failed to update profile', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="pb-8 mb-8 border-b border-slate-200 flex items-center gap-6">
        <IKContext 
          publicKey={import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY} 
          urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT} 
          authenticator={authenticator} 
        >
          <div className="relative group cursor-pointer w-20 h-20 rounded-full overflow-hidden shadow-sm border border-slate-200 bg-slate-50 flex-shrink-0">
            {formData.profilePicture ? (
              <img src={formData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-blue-50 flex items-center justify-center text-blue-500">
                <UserCircle size={40} />
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 hidden group-hover:flex flex-col items-center justify-center transition-all">
              <UploadCloud size={18} className="text-white mb-1" />
              <span className="text-white text-[10px] font-medium">Upload</span>
            </div>
            <IKUpload 
              fileName="profile-photo.jpg"
              onSuccess={(res) => setFormData({ ...formData, profilePicture: res.url })}
              onError={(err) => console.log('Upload error', err)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </IKContext>
        
        <div>
          <h2 className="text-3xl font-bold text-slate-800">My Profile</h2>
          <p className="text-slate-500 mt-1">Update your personal details and photo</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {message.text && (
          <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Full Name</label>
            <input 
              type="text" 
              name="name"
              value={formData.name} 
              onChange={handleChange}
              className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Email Address</label>
            <input 
              type="email" 
              name="email"
              value={formData.email} 
              onChange={handleChange}
              className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" 
              required 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Date of Birth</label>
            <input 
              type="date" 
              name="dateOfBirth"
              value={formData.dateOfBirth} 
              onChange={handleChange}
              className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" 
            />
          </div>

          <div className="space-y-2 relative">
            <label className="text-sm font-medium text-slate-700">Club</label>
            <select 
              name="club"
              value={formData.club} 
              onChange={handleChange}
              className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none appearance-none" 
            >
              <option value="" disabled>Select a club</option>
              {clubsList.map((c) => (
                <option key={c._id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">New Password (Optional)</label>
            <input 
              type="password" 
              name="password"
              value={formData.password} 
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
              className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" 
            />
          </div>
        </div>

        <div className="pt-6 mt-8 border-t border-slate-200 flex justify-start">
          <button 
            type="submit" 
            disabled={isLoading}
            className="h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-70"
          >
            <Save size={18} />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
