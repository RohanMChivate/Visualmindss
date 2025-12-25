
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface RegisterProps {
  register: (name: string, email: string) => void;
}

const Register: React.FC<RegisterProps> = ({ register }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(name, email);
    navigate('/select-class');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-sky-50">
      <div className="max-w-md w-full glass-card p-8 rounded-3xl shadow-2xl border-4 border-white">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-400 rounded-3xl mx-auto flex items-center justify-center shadow-xl mb-4 transform -rotate-6">
            <span className="text-4xl">✨</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Join the Fun!</h1>
          <p className="text-slate-500 mt-2 text-lg">Let's create your learning profile.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-slate-700 font-semibold mb-2 ml-1">Your Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="What's your name?"
              className="w-full px-5 py-3 rounded-2xl border-2 border-slate-200 focus:border-green-400 focus:outline-none transition-colors text-lg text-slate-900"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-2 ml-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="e.g. cool.kid@fun.com"
              className="w-full px-5 py-3 rounded-2xl border-2 border-slate-200 focus:border-green-400 focus:outline-none transition-colors text-lg text-slate-900"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-transform active:scale-95 text-xl"
          >
            Create My Account! 🎉
          </button>
        </form>

        <p className="mt-8 text-center text-slate-600 font-medium">
          Already have one? <Link to="/login" className="text-sky-600 hover:underline">Log in here!</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
