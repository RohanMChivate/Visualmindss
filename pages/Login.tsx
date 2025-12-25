
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserRole } from '../types';

interface LoginProps {
  login: (email: string, role: UserRole, password?: string) => boolean;
}

const Login: React.FC<LoginProps> = ({ login }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email!');
      return;
    }
    
    if (login(email.trim(), role, role === UserRole.ADMIN ? password : undefined)) {
      navigate('/');
    } else {
      setError(role === UserRole.ADMIN 
        ? 'Invalid email or secret code!' 
        : 'Account not found! Did you sign up yet?');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-sky-50">
      <div className="max-w-md w-full glass-card p-10 rounded-[3rem] shadow-2xl border-4 border-white">
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-yellow-400 rounded-[2rem] mx-auto flex items-center justify-center shadow-xl mb-6 transform rotate-6 hover:rotate-0 transition-transform cursor-pointer">
            <span className="text-5xl">👋</span>
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Welcome Back!</h1>
          <p className="text-slate-500 mt-2 text-xl font-medium">Ready for another adventure?</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-slate-700 font-black ml-2 uppercase text-xs tracking-widest">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              required
              placeholder="kid@fun.com"
              className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-sky-400 focus:outline-none transition-all text-lg font-bold shadow-inner bg-slate-50 text-slate-900"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-slate-700 font-black ml-2 uppercase text-xs tracking-widest">Are you a...</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => { setRole(UserRole.STUDENT); setError(''); }}
                className={`py-4 rounded-2xl font-black transition-all border-4 ${
                  role === UserRole.STUDENT 
                    ? 'bg-sky-500 border-sky-200 text-white shadow-lg scale-105' 
                    : 'bg-white border-slate-50 text-slate-400'
                }`}
              >
                Student 🎒
              </button>
              <button
                type="button"
                onClick={() => { setRole(UserRole.ADMIN); setError(''); }}
                className={`py-4 rounded-2xl font-black transition-all border-4 ${
                  role === UserRole.ADMIN 
                    ? 'bg-amber-500 border-amber-200 text-white shadow-lg scale-105' 
                    : 'bg-white border-slate-50 text-slate-400'
                }`}
              >
                Teacher 🍎
              </button>
            </div>
          </div>

          {role === UserRole.ADMIN && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-2">
              <label className="block text-slate-700 font-black ml-2 uppercase text-xs tracking-widest">Teacher Secret Code</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                required={role === UserRole.ADMIN}
                placeholder="••••••••"
                className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-amber-400 focus:outline-none transition-all text-lg font-bold shadow-inner bg-slate-50 text-slate-900"
              />
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl border-2 border-red-100 text-center font-bold animate-shake">
              {error}
            </div>
          )}

          <button 
            type="submit"
            className={`w-full text-white font-black py-5 rounded-[2rem] shadow-xl transition-all active:scale-95 text-2xl ${
              role === UserRole.ADMIN ? 'bg-amber-500 hover:bg-amber-600' : 'bg-sky-500 hover:bg-sky-600'
            }`}
          >
            Start {role === UserRole.ADMIN ? 'Teaching' : 'Learning'}! 🚀
          </button>
        </form>

        <div className="mt-8 text-center">
          {role === UserRole.STUDENT ? (
            <p className="text-slate-500 font-bold">
              New to VisualMinds? <Link to="/register" className="text-sky-600 underline hover:text-sky-700">Create account!</Link>
            </p>
          ) : (
            <p className="text-slate-400 font-bold text-sm">
              Teachers: Ask admin if you lost your code.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
