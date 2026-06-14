import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { UploadCloud, X } from 'lucide-react';
import { IKContext, IKUpload } from 'imagekitio-react';
import { useNavigate, useParams } from 'react-router-dom';

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

const EditEvent = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [eventName, setEventName] = useState('');
  const [eventCategory, setEventCategory] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventVolunteers, setEventVolunteers] = useState('');
  const [eventBeneficiaries, setEventBeneficiaries] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventPhotos, setEventPhotos] = useState([]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/events/${id}`, {
          headers: { Authorization: `Bearer ${user?.token || JSON.parse(localStorage.getItem('userInfo') || '{}').token}` }
        });
        setEventName(data.name || '');
        setEventCategory(data.category || '');
        if (data.date) {
            setEventDate(new Date(data.date).toISOString().split('T')[0]);
        }
        setEventLocation(data.location || '');
        setEventVolunteers(data.volunteers || '');
        setEventBeneficiaries(data.beneficiaries || '');
        setEventDescription(data.description || '');
        setEventPhotos(data.photos || []);
      } catch (error) {
        console.error('Failed to fetch event details', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvent();
  }, [id, user]);

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    if (!eventName.trim() || !eventDescription.trim() || !eventCategory || !eventDate || !eventLocation) {
      alert('Please fill in all the required fields.');
      return;
    }

    setIsSaving(true);
    try {
      await axios.put(`http://localhost:5000/api/events/${id}`, 
        {
          name: eventName,
          category: eventCategory,
          date: eventDate,
          location: eventLocation,
          volunteers: Number(eventVolunteers) || 0,
          beneficiaries: Number(eventBeneficiaries) || 0,
          description: eventDescription,
          photos: eventPhotos
        },
        { headers: { Authorization: `Bearer ${user?.token || JSON.parse(localStorage.getItem('userInfo') || '{}').token}` } }
      );

      navigate(`/dashboard/reports/${id}`);
    } catch (error) {
      console.error('Failed to update event', error);
      alert('Failed to update event.');
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-8 text-slate-500">Loading event details...</div>;

  return (
    <div className="max-w-4xl">
      <div className="mb-8 border-b border-slate-200 pb-8">
        <h2 className="text-3xl font-bold text-slate-800">Edit Event</h2>
        <p className="text-slate-500 mt-1">Modify the details of your official event report.</p>
      </div>

      <form onSubmit={handleUpdateEvent} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Event Name</label>
            <input 
              type="text" 
              required
              autoFocus
              placeholder="e.g. Blood Donation Drive"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
            <select
              required
              value={eventCategory}
              onChange={(e) => setEventCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm appearance-none"
            >
              <option value="" disabled>Select category</option>
              <option value="Education">Education</option>
              <option value="Health">Health</option>
              <option value="Environment">Environment</option>
              <option value="Community Service">Community Service</option>
              <option value="Professional Dev">Professional Dev</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Date</label>
            <input 
              type="date" 
              required
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Location</label>
            <input 
              type="text" 
              required
              placeholder="e.g. City Hospital, Pune"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Number of Volunteers</label>
            <input 
              type="number" 
              min="0"
              required
              placeholder="0"
              value={eventVolunteers}
              onChange={(e) => setEventVolunteers(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Number of Beneficiaries</label>
            <input 
              type="number" 
              min="0"
              required
              placeholder="0"
              value={eventBeneficiaries}
              onChange={(e) => setEventBeneficiaries(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5 flex justify-between">
            <span>Event Description</span>
            <span className="text-slate-400 font-normal">Aim for at least 100 words</span>
          </label>
          <textarea 
            required
            rows={6}
            placeholder="Write a detailed description of the event..."
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm resize-y"
          ></textarea>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700">Event Photos</label>
          <IKContext 
            publicKey={import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY} 
            urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT} 
            authenticator={authenticator} 
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {eventPhotos.map((url, i) => (
                <div key={i} className="relative w-full h-32 rounded-xl overflow-hidden border border-slate-200">
                  <img src={url} alt={`Upload ${i}`} className="w-full h-full object-cover" />
                  <button 
                    type="button" 
                    onClick={() => setEventPhotos(prev => prev.filter((_, index) => index !== i))} 
                    className="absolute top-1 right-1 bg-white/80 hover:bg-white text-red-500 rounded-full p-1.5 transition-colors shadow-sm"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}

              <div className="relative group cursor-pointer w-full h-32 rounded-xl overflow-hidden border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center transition-colors hover:bg-slate-100 hover:border-slate-400">
                <div className="flex flex-col items-center justify-center text-slate-500">
                  <UploadCloud size={24} className="mb-2 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  <span className="text-xs font-medium text-center px-4">Upload Photo</span>
                </div>
                <IKUpload 
                  fileName={`event-${Date.now()}.jpg`}
                  onSuccess={(res) => setEventPhotos(prev => [...prev, res.url])}
                  onError={(err) => console.log('Upload error', err)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </IKContext>
        </div>
        
        <div className="pt-6 border-t border-slate-100 flex justify-start">
          <button 
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-xl transition-colors flex items-center gap-2"
          >
            {isSaving ? 'Updating...' : 'Update Event'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEvent;
