import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/rotaractlogo.png';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="h-[70px] sticky top-0 w-full px-6 md:px-16 lg:px-24 xl:px-32 flex items-center justify-between z-50 bg-white text-gray-700 shadow-[0px_4px_25px_0px_#0000000D] transition-all">
      <Link to="/" className="flex items-center">
        <img src={logo} alt="Rotaract Logo" className="h-10 w-auto" />
      </Link>

      <ul className="md:flex hidden items-center gap-10">
        <li><Link className="hover:text-gray-500/80 transition" to="/">Home</Link></li>
        <li><a className="hover:text-gray-500/80 transition" href="#">Services</a></li>
        <li><a className="hover:text-gray-500/80 transition" href="#">Portfolio</a></li>
        <li><a className="hover:text-gray-500/80 transition" href="#">Pricing</a></li>
      </ul>

      <div className="md:flex hidden items-center gap-4">
        {!user ? (
          <Link to="/login" className="flex items-center justify-center bg-white text-gray-600 border border-gray-300 text-sm hover:bg-gray-50 active:scale-95 transition-all w-40 h-11 rounded-full">
            Login
          </Link>
        ) : (
          <>
            {user.role === 'Admin' && (
              <Link to="/dashboard" className="flex items-center justify-center bg-white text-gray-600 border border-gray-300 text-sm hover:bg-gray-50 active:scale-95 transition-all w-32 h-11 rounded-full">
                Dashboard
              </Link>
            )}
            <button onClick={handleLogout} className="flex items-center justify-center bg-white text-red-600 border border-red-200 text-sm hover:bg-red-50 active:scale-95 transition-all w-32 h-11 rounded-full">
              Logout
            </button>
          </>
        )}
      </div>

      <button 
        aria-label="menu-btn" 
        type="button" 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="menu-btn inline-block md:hidden active:scale-90 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="#000">
            <path d="M 3 7 A 1.0001 1.0001 0 1 0 3 9 L 27 9 A 1.0001 1.0001 0 1 0 27 7 L 3 7 z M 3 14 A 1.0001 1.0001 0 1 0 3 16 L 27 16 A 1.0001 1.0001 0 1 0 27 14 L 3 14 z M 3 21 A 1.0001 1.0001 0 1 0 3 23 L 27 23 A 1.0001 1.0001 0 1 0 27 21 L 3 21 z"></path>
        </svg>
      </button>

      {isMobileMenuOpen && (
        <div className="mobile-menu absolute top-[70px] left-0 w-full bg-white p-6 md:hidden shadow-lg border-t border-gray-100">
          <ul className="flex flex-col space-y-4 text-lg">
            <li><Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-sm">Home</Link></li>
            <li><a href="#" className="text-sm">Services</a></li>
            <li><a href="#" className="text-sm">Portfolio</a></li>
            <li><a href="#" className="text-sm">Pricing</a></li>
          </ul>

          <div className="mt-6 flex flex-col gap-4">
            {!user ? (
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center bg-white text-gray-600 border border-gray-300 text-sm hover:bg-gray-50 active:scale-95 transition-all w-full h-11 rounded-full">
                Login
              </Link>
            ) : (
              <>
                {user.role === 'Admin' && (
                  <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center bg-white text-gray-600 border border-gray-300 text-sm hover:bg-gray-50 active:scale-95 transition-all w-full h-11 rounded-full">
                    Dashboard
                  </Link>
                )}
                <button onClick={handleLogout} className="flex items-center justify-center bg-white text-red-600 border border-red-200 text-sm hover:bg-red-50 active:scale-95 transition-all w-full h-11 rounded-full">
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
