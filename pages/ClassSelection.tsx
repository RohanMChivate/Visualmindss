
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClassLevel } from '../types';

interface Props {
  currentClass?: ClassLevel;
  setClass: (level: ClassLevel) => void;
}

const ClassSelection: React.FC<Props> = ({ currentClass, setClass }) => {
  const navigate = useNavigate();

  const handleSelect = (level: ClassLevel) => {
    setClass(level);
    navigate('/dashboard');
  };

  const classes = [
    { level: ClassLevel.CLASS_3, title: 'Class 3', color: 'bg-rose-400', icon: '🎨', desc: 'Numbers & Shapes' },
    { level: ClassLevel.CLASS_4, title: 'Class 4', color: 'bg-sky-400', icon: '🐵', desc: 'Language & Logic' },
    { level: ClassLevel.CLASS_5, title: 'Class 5', color: 'bg-amber-400', icon: '🛠️', desc: 'History & Science' },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] p-6 bg-sky-50">
      <div className="max-w-4xl mx-auto text-center mt-10">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">Pick Your Class!</h1>
        <p className="text-xl text-slate-600 mb-12">Choose where you want to learn today.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {classes.map((c) => (
            <button
              key={c.level}
              onClick={() => handleSelect(c.level)}
              className={`group p-8 rounded-[2.5rem] border-b-8 shadow-xl transition-all hover:-translate-y-2 active:scale-95 ${c.color} border-black/10`}
            >
              <div className="w-24 h-24 bg-white/30 rounded-full mx-auto flex items-center justify-center text-5xl mb-6 backdrop-blur-sm group-hover:scale-110 transition-transform">
                {c.icon}
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">{c.title}</h2>
              <p className="text-white/80 font-medium">{c.desc}</p>
              
              <div className="mt-8 bg-white/20 py-2 px-4 rounded-full text-white font-bold inline-block hover:bg-white/40 transition-colors">
                Select Class
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClassSelection;
