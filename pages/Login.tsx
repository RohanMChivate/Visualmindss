
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserRole } from '../types';

interface LoginProps {
  login: (email: string, role: UserRole) => boolean;
}

const Login: React.FC<LoginProps> = ({ login }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, role)) {
      navigate('/');
    } else {
      setError('Oops! We couldn\'t find that user. Try again?');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-sky-50">
      <div className="max-w-md w-full glass-card p-8 rounded-3xl shadow-2xl border-4 border-white">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-yellow-400 rounded-3xl mx-auto flex items-center justify-center shadow-xl mb-4 transform rotate-6">
            <span className="text-4xl">👋</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Welcome Back!</h1>
          <p className="text-slate-500 mt-2 text-lg">Let's continue our learning journey!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-slate-700 font-semibold mb-2 ml-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="e.g. kid@fun.com"
              className="w-full px-5 py-3 rounded-2xl border-2 border-slate-200 focus:border-sky-400 focus:outline-none transition-colors text-lg"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-2 ml-1">Who are you?</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole(UserRole.STUDENT)}
                className={`py-3 rounded-2xl font-bold transition-all border-2 ${
                  role === UserRole.STUDENT 
                    ? 'bg-sky-500 border-sky-600 text-white shadow-lg scale-105' 
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                Student 🎒
              </button>
              <button
                type="button"
                onClick={() => setRole(UserRole.ADMIN)}
                className={`py-3 rounded-2xl font-bold transition-all border-2 ${
                  role === UserRole.ADMIN 
                    ? 'bg-amber-500 border-amber-600 text-white shadow-lg scale-105' 
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                Teacher 🍎
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-center font-medium bg-red-50 py-2 rounded-xl">{error}</p>}

          <button 
            type="submit"
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-transform active:scale-95 text-xl"
          >
            Start Learning! 🚀
          </button>
        </form>

        {role === UserRole.STUDENT && (
          <p className="mt-8 text-center text-slate-600 font-medium">
            New here? <Link to="/register" className="text-sky-600 hover:underline">Create an Account!</Link>
          </p>
        )}
        
        {role === UserRole.ADMIN && (
          <div className="mt-6 p-4 bg-amber-50 rounded-2xl border-2 border-dashed border-amber-200 text-center text-sm text-amber-700">
            Admin access is for teachers only. <br/> Use: <b>admin@visualminds.com</b>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
