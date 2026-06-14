import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileText, Edit, Sparkles, Target, Share2, Copy } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { generatePdfReport } from '../utils/pdfGenerator';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isGeneratingPoster, setIsGeneratingPoster] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/events/${id}`, {
          headers: { Authorization: `Bearer ${user?.token || JSON.parse(localStorage.getItem('userInfo') || '{}').token}` }
        });
        setEvent(data);
      } catch (error) {
        console.error('Failed to fetch event', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvent();
  }, [id, user]);

  const handleGenerateAI = async () => {
    setIsGeneratingAI(true);
    try {
      const { data } = await axios.post(`http://localhost:5000/api/events/${id}/analyze`, {}, {
        headers: { Authorization: `Bearer ${user?.token || JSON.parse(localStorage.getItem('userInfo') || '{}').token}` }
      });
      setEvent(data);
    } catch (error) {
      console.error('Failed to generate AI analysis', error);
      alert('Failed to generate insights. Check console for details.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleGeneratePoster = async () => {
    setIsGeneratingPoster(true);
    try {
      const { data } = await axios.post(`http://localhost:5000/api/events/${id}/poster`, {}, {
        headers: { Authorization: `Bearer ${user?.token || JSON.parse(localStorage.getItem('userInfo') || '{}').token}` }
      });
      setEvent(data);
    } catch (error) {
      console.error('Failed to generate AI poster', error);
      alert('Failed to generate poster. Check console for details.');
    } finally {
      setIsGeneratingPoster(false);
    }
  };

  const handleGenerateReport = () => {
    if (!event) return;
    generatePdfReport(event);
  };

  if (isLoading) return <div className="p-8 text-slate-500">Loading event details...</div>;
  if (!event) return <div className="p-8 text-slate-500">Event not found.</div>;

  return (
    <div className="max-w-4xl">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">{event.name}</h2>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            <span>By {event.author?.name || 'Unknown'}</span>
            <span>•</span>
            <span>{new Date(event.createdAt).toLocaleDateString()}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/dashboard/reports')}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors text-sm"
          >
            <ArrowLeft size={18} /> Back
          </button>
          
          {user?.role !== 'Member' && (
            <button 
              onClick={() => navigate(`/dashboard/edit-event/${event._id}`)}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors text-sm"
            >
              <Edit size={18} /> Edit Event
            </button>
          )}

          <button 
            onClick={handleGenerateReport}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors text-sm"
          >
            <Download size={18} /> Download Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Date</h4>
          <p className="text-slate-800 font-medium">{event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}</p>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Location</h4>
          <p className="text-slate-800 font-medium">{event.location || 'N/A'}</p>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Category</h4>
          <p className="text-slate-800 font-medium">{event.category || 'N/A'}</p>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Impact</h4>
          <p className="text-slate-800 font-medium">{event.volunteers || 0} Vols • {event.beneficiaries || 0} Benfs</p>
        </div>
      </div>

      <div className="space-y-8">
        {event.photos && event.photos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {event.photos.map((photoUrl, i) => (
              <div key={i} className="h-64 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                <img src={photoUrl} alt={`Event photo ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
        
        {(!event.photos || event.photos.length === 0) && (
           <div className="w-full h-48 flex items-center justify-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <FileText size={48} opacity={0.5} />
           </div>
        )}

        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-3">Event Description</h3>
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
            {event.description}
          </div>
        </div>

        {/* AI GENERATION CTA */}
        {!event.aiReport && user?.role !== 'Member' && (
          <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 p-8 rounded-2xl border border-indigo-100 flex flex-col items-center justify-center text-center">
            <div className="bg-white p-3 rounded-full shadow-sm mb-4">
              <Sparkles className="text-indigo-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Unlock Smart Reporting</h3>
            <p className="text-slate-600 max-w-lg mb-6 text-sm">Use Gemini AI to instantly generate a formal report, analyze SDG impact, and write platform-specific social media captions for this event.</p>
            <button 
              onClick={handleGenerateAI}
              disabled={isGeneratingAI}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-xl transition-all flex items-center gap-2 shadow-sm"
            >
              {isGeneratingAI ? 'Generating Insights...' : 'Generate AI Insights ✨'}
            </button>
          </div>
        )}

        {/* AI RESULTS SECTION */}
        {event.aiReport && (
          <div className="mt-12 space-y-8 border-t border-slate-200 pt-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Sparkles className="text-indigo-600" size={24} />
                <h2 className="text-2xl font-bold text-slate-800">AI Impact Analysis & Reporting</h2>
              </div>
              {user?.role !== 'Member' && (
                <button 
                  onClick={handleGenerateAI}
                  disabled={isGeneratingAI}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium rounded-xl transition-colors text-sm disabled:opacity-50"
                >
                  <Sparkles size={16} />
                  {isGeneratingAI ? 'Regenerating...' : 'Regenerate Analysis'}
                </button>
              )}
            </div>

            {/* IMPACT ANALYSIS */}
            {event.impactAnalysis && Object.keys(event.impactAnalysis).length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
                  <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path strokeDasharray="100, 100" className="text-slate-100 stroke-current" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <path strokeDasharray={`${event.impactAnalysis.impactScore || 0}, 100`} className="text-indigo-600 stroke-current" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <div className="absolute text-3xl font-bold text-slate-800">{event.impactAnalysis.impactScore || 0}</div>
                  </div>
                  <h4 className="font-bold text-slate-800 text-lg mb-1">{event.impactAnalysis.rating || 'Analyzed'}</h4>
                  <p className="text-sm text-slate-500">{event.impactAnalysis.summary || 'AI impact assessment'}</p>
                </div>
                <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Target size={18} className="text-indigo-500"/> SDGs Impacted</h4>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {event.impactAnalysis.sdgMapped?.map((sdg, idx) => (
                      <span key={idx} title={sdg.reason} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100">
                        SDG {sdg.sdg}: {sdg.name}
                      </span>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                       <h5 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">Strengths</h5>
                       <ul className="text-sm text-slate-600 space-y-1">
                         {event.impactAnalysis.strengths?.map((s, i) => <li key={i}>• {s}</li>)}
                       </ul>
                    </div>
                    <div>
                       <h5 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">Areas for Improvement</h5>
                       <ul className="text-sm text-slate-600 space-y-1">
                         {event.impactAnalysis.improvements?.map((s, i) => <li key={i}>• {s}</li>)}
                       </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* AI REPORT */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-4 flex items-center gap-2">
                  <FileText size={20} className="text-slate-400" /> Formal Report
                </h3>
                <div className="prose prose-sm prose-slate max-w-none text-slate-700 whitespace-pre-wrap h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {event.aiReport}
                </div>
              </div>

              {/* SOCIAL MEDIA CAPTIONS */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Share2 size={20} className="text-slate-400" /> Social Media Toolkit
                  </h3>
                  {user?.role !== 'Member' && (
                    <button 
                      onClick={handleGeneratePoster}
                      disabled={isGeneratingPoster}
                      className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
                    >
                      <Sparkles size={14} />
                      {isGeneratingPoster ? 'Generating Poster...' : 'Generate AI Poster'}
                    </button>
                  )}
                </div>
                
                {event.aiPoster && (
                   <div className="mb-6 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
                     <img src={event.aiPoster} alt="AI Generated Poster" className="w-full h-auto object-cover max-h-64" />
                     <div className="p-3 bg-white border-t border-slate-200 flex justify-end">
                       <a 
                         href={event.aiPoster} 
                         download 
                         target="_blank" 
                         rel="noreferrer"
                         className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
                       >
                         <Download size={14} /> Download Poster
                       </a>
                     </div>
                   </div>
                )}
                
                {event.socialCaptions && Object.keys(event.socialCaptions).length > 0 ? (
                  <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {Object.entries(event.socialCaptions).map(([platform, caption]) => (
                      <div key={platform} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                         <div className="flex justify-between items-center mb-2">
                           <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">{platform}</span>
                           <button 
                             onClick={() => navigator.clipboard.writeText(caption)}
                             className="text-slate-400 hover:text-indigo-600 transition-colors"
                             title="Copy to clipboard"
                           >
                             <Copy size={14} />
                           </button>
                         </div>
                         <p className="text-sm text-slate-700 whitespace-pre-wrap">{caption}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">No captions generated.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
