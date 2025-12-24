
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserRole } from '../types';

interface NavbarProps {
  store: any;
}

const Navbar: React.FC<NavbarProps> = ({ store }) => {
  const { currentUser, logout } = store;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAvatarUrl = currentUser?.avatar && (currentUser.avatar.startsWith('data:') || currentUser.avatar.startsWith('http'));

  return (
    <nav className="bg-white shadow-md border-b-4 border-sky-200 px-4 py-3 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-lg transform -rotate-3 group-hover:rotate-0 transition-transform">
            <span className="text-2xl">🧠</span>
          </div>
          <span className="text-2xl font-bold text-sky-600 hidden sm:block">VisualMinds</span>
        </Link>

        <div className="flex items-center space-x-4">
          {currentUser?.role === UserRole.STUDENT && (
            <div className="hidden md:flex items-center space-x-1">
              <Link to="/dashboard" className="text-slate-600 hover:text-sky-500 font-bold text-lg px-3 py-1 rounded-lg hover:bg-sky-50 transition-colors">
                Dashboard
              </Link>
              <Link to="/progress" className="text-slate-600 hover:text-sky-500 font-bold text-lg px-3 py-1 rounded-lg hover:bg-sky-50 transition-colors">
                Progress
              </Link>
            </div>
          )}
          
          <div className="flex items-center space-x-3 bg-slate-100 pl-1 pr-3 py-1 rounded-full border-2 border-slate-200 shadow-sm">
            <Link to="/profile" className="flex items-center space-x-2 group">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-sky-400 shadow-sm group-hover:scale-110 transition-transform">
                {isAvatarUrl ? (
                  <img 
                    src={currentUser?.avatar} 
                    key={currentUser?.avatar} // Key forces re-render if URL updates
                    alt="Profile" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <span className="text-xl">{currentUser?.avatar || '😊'}</span>
                )}
              </div>
              <span className="text-slate-700 font-bold group-hover:text-sky-600 transition-colors hidden xs:block">
                {currentUser?.name}
              </span>
            </Link>
            
            <button 
              onClick={handleLogout}
              className="p-1 text-slate-400 hover:text-red-500 transition-colors border-l pl-2 border-slate-300 ml-1"
              title="Logout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
