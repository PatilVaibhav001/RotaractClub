import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('admin@rotaract.org');
  const [password, setPassword] = useState('admin123');
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [club, setClub] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [clubsList, setClubsList] = useState([]);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/clubs');
        setClubsList(data);
      } catch (error) {
        console.error('Failed to fetch clubs', error);
      }
    };
    fetchClubs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const config = {
        headers: { 'Content-Type': 'application/json' },
      };

      const url = isLogin 
        ? 'http://localhost:5000/api/auth/login'
        : 'http://localhost:5000/api/auth/register';
        
      const payload = isLogin 
        ? { email, password }
        : { name, email, password, dateOfBirth, club };

      const { data } = await axios.post(url, payload, config);

      if (isLogin) {
        login(data);
        if (data.role === 'Admin') {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      } else {
        setSuccessMsg(data.message || 'Registration successful! Pending admin approval.');
        setIsLogin(true);
      }
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : `Failed to ${isLogin ? 'login' : 'register'}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative">
      <button 
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-medium text-sm"
      >
        <ArrowLeft size={16} />
        Back to Home
      </button>

      <form onSubmit={handleSubmit} className="max-w-96 w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white shadow-sm">
        <h1 className="text-gray-900 text-3xl mt-10 font-medium">{isLogin ? 'Login' : 'Sign up'}</h1>
        <p className="text-gray-500 text-sm mt-2 mb-8">{isLogin ? 'Please sign in to continue' : 'Become a member'}</p>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs font-medium text-left">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-xs font-medium text-left">
            {successMsg}
          </div>
        )}

        {!isLogin && (
          <div className="flex items-center w-full mt-8 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 pr-4 gap-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <input 
                type="text" 
                placeholder="Full Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm w-full h-full" 
                required 
              />                 
          </div>
        )}

        <div className={`flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all ${isLogin ? 'mt-8' : 'mt-4'}`}>
            <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                <path fillRule="evenodd" clipRule="evenodd" d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z" fill="#6B7280"/>
            </svg>
            <input 
              type="email" 
              placeholder="Email id" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm w-full h-full" 
              required 
            />                 
        </div>

        <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 pr-4 gap-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
            <svg width="13" height="17" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                <path d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z" fill="#6B7280"/>
            </svg>
            <input 
              type={showPassword ? 'text' : 'password'} 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm w-full h-full" 
              required 
            />                 
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-blue-600 transition-colors flex-shrink-0 focus:outline-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>

        {!isLogin && (
          <>
            <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 pr-4 gap-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <input 
                  type="date" 
                  placeholder="Date of Birth" 
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm w-full h-full" 
                  required 
                />                 
            </div>

            <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 pr-4 gap-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all relative">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><path d="M3 21h18"/><path d="M9 8h1"/><path d="M9 12h1"/><path d="M9 16h1"/><path d="M14 8h1"/><path d="M14 12h1"/><path d="M14 16h1"/><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/></svg>
                <select 
                  value={club}
                  onChange={(e) => setClub(e.target.value)}
                  className="w-full bg-transparent outline-none h-full text-sm text-gray-900 appearance-none"
                  required 
                >
                  <option value="" disabled>Select a club name to join</option>
                  {clubsList.map((c) => (
                    <option key={c._id} value={c.name}>{c.name}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                   <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>
          </>
        )}

        {isLogin ? (
          <div className="mt-5 text-left text-blue-600">
              <a className="text-sm font-medium hover:underline" href="#">Forgot password?</a>
          </div>
        ) : (
          <div className="mt-5"></div>
        )}

        <button 
          type="submit" 
          disabled={isLoading}
          className={`w-full h-11 rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-colors font-medium ${isLogin ? 'mt-2' : 'mt-5'} disabled:opacity-70`}
        >
            {isLoading ? 'Processing...' : isLogin ? 'Login' : 'Request to Join'}
        </button>
        <p className="text-gray-500 text-sm mt-4 mb-11">
          {isLogin ? "Don’t have an account? " : "Already have an account? "}
          <button 
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(''); }} 
            className="text-blue-600 font-medium hover:underline"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
