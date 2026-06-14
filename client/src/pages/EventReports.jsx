import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, FileText, Download, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { generatePdfReport } from '../utils/pdfGenerator';

const EventReports = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/events', {
        headers: { Authorization: `Bearer ${user?.token || JSON.parse(localStorage.getItem('userInfo') || '{}').token}` }
      });
      setEvents(data);
    } catch (error) {
      console.error('Failed to fetch events', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleGenerateReport = (event) => {
    generatePdfReport(event);
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/events/${id}`, {
        headers: { Authorization: `Bearer ${user?.token || JSON.parse(localStorage.getItem('userInfo') || '{}').token}` }
      });
      setEvents(events.filter(e => e._id !== id));
    } catch (error) {
      console.error('Failed to delete event', error);
      alert('Failed to delete event');
    }
  };

  if (isLoading) return <div className="p-8 text-slate-500">Loading events...</div>;

  return (
    <div className="max-w-7xl">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Event Reports</h2>
          <p className="text-slate-500 mt-1">Manage and generate official reports for your club's events.</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/add-event')}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors text-sm"
        >
          <Plus size={18} /> Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {events.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500">
            No event reports found. Click "Add Event" to create one.
          </div>
        ) : (
          events.map((event) => (
            <div key={event._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="h-36 bg-slate-100 relative">
                {event.photos && event.photos.length > 0 ? (
                  <img src={event.photos[0]} alt={event.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <FileText size={48} opacity={0.5} />
                  </div>
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-base font-bold text-slate-800 mb-1 line-clamp-1">{event.name}</h3>
                <p className="text-xs text-slate-600 line-clamp-2 mb-3 flex-1">{event.description}</p>
                
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 mb-3">
                  <span className="truncate pr-2 font-medium text-slate-600">{event.category || 'Event'}</span>
                  <span className="shrink-0">{event.date ? new Date(event.date).toLocaleDateString() : new Date(event.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex gap-1.5 mt-auto">
                  <button 
                    onClick={() => navigate(`/dashboard/reports/${event._id}`)} 
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors font-medium text-xs"
                  >
                    Details
                  </button>
                  <button 
                    onClick={() => handleGenerateReport(event)} 
                    title="Generate Report"
                    className="px-2.5 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Download size={14} />
                  </button>
                  {user?.role !== 'Member' && (
                    <button 
                      onClick={() => handleDeleteEvent(event._id)} 
                      title="Delete Event"
                      className="px-2.5 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventReports;
