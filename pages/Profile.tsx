import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole, ClassLevel } from '../types';

interface Props {
  store: any;
}

const GIVEN_AVATARS = ['😊', '🦁', '🐱', '🐼', '🦊', '🚀', '🎨', '🦖', '🦄', '🌟', '🍩', '⚽', '🍦', '🛸', '🦒', '🤖'];

const Profile: React.FC<Props> = ({ store }) => {
  const { currentUser, updateProfile } = store;
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(currentUser?.name || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '😊');
  const [selectedClass, setSelectedClass] = useState<ClassLevel>(currentUser?.selectedClass || ClassLevel.CLASS_3);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isCustom, setIsCustom] = useState(currentUser?.avatar?.startsWith('data:image') || false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(name, avatar, currentUser?.role === UserRole.STUDENT ? selectedClass : undefined);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  const handleEmojiSelect = (emoji: string) => {
    setAvatar(emoji);
    setIsCustom(false);
  };

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
        setIsCustom(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const isAvatarUrl = avatar.startsWith('data:image') || avatar.startsWith('http');

  const handleBack = () => {
    if (currentUser?.role === UserRole.ADMIN) {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 p-6 md:p-10">
      <div className="max-w-2xl mx-auto">
        {/* Chunky Back Button */}
        <button 
          onClick={handleBack}
          className="mb-8 group flex items-center space-x-4 bg-white border-b-8 border-sky-200 px-8 py-4 rounded-[2rem] shadow-xl hover:-translate-y-1 active:translate-y-1 active:border-b-0 active:scale-95 transition-all"
        >
          <div className="w-10 h-10 bg-sky-400 rounded-xl flex items-center justify-center text-white shadow-lg transform -rotate-6 group-hover:rotate-0 transition-transform">
            <span className="text-2xl">🏠</span>
          </div>
          <span className="text-xl font-black text-slate-700">Back to {currentUser?.role === UserRole.ADMIN ? 'Admin Hub' : 'Home'}</span>
        </button>

        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border-4 border-white relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-sky-100 rounded-bl-[100%] opacity-40 -z-0"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-100 rounded-tr-full opacity-30 -z-0"></div>
          
          <div className="relative z-10">
            <header className="text-center mb-12">
              <div className="relative inline-block">
                {/* Profile Preview Container */}
                <div className={`w-36 h-36 md:w-44 md:h-44 bg-sky-200 rounded-[3rem] flex items-center justify-center text-8xl overflow-hidden border-8 border-white shadow-2xl mx-auto transition-all ${isSuccess ? 'scale-105 border-green-400' : ''}`}>
                  {isAvatarUrl ? (
                    <img src={avatar} alt="Current Selection" className="w-full h-full object-cover" />
                  ) : (
                    <span>{avatar}</span>
                  )}
                </div>
                
                {/* Upload Button */}
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 bg-amber-400 hover:bg-amber-500 text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl border-4 border-white transition-transform active:scale-90 z-20"
                  title="Upload Custom Photo"
                >
                  <span className="text-2xl">📸</span>
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleCustomUpload} 
                />

                {/* Status Badge */}
                {isCustom && (
                  <div className="absolute -top-2 -left-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg border-2 border-white uppercase tracking-tighter">
                    Custom Photo
                  </div>
                )}
              </div>
              
              <h1 className="text-4xl font-black text-slate-800 mt-6">My Profile</h1>
              <p className="text-slate-500 font-bold mt-2 text-lg italic">"Show your true colors!" 🎨</p>
            </header>

            <form onSubmit={handleSave} className="space-y-10">
              {/* Name Input */}
              <div>
                <label className="block text-slate-700 font-black mb-3 ml-2 text-lg uppercase tracking-wide">Your Learning Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-8 py-5 bg-slate-50 rounded-[2rem] border-4 border-slate-100 focus:border-sky-400 focus:outline-none transition-all text-2xl font-black text-slate-800 shadow-inner placeholder:text-slate-300"
                  placeholder="Cool Kid 123"
                  required
                />
              </div>

              {/* Class Selection for Students */}
              {currentUser?.role === UserRole.STUDENT && (
                <div>
                  <label className="block text-slate-700 font-black mb-3 ml-2 text-lg uppercase tracking-wide">My Current Class</label>
                  <div className="grid grid-cols-3 gap-4">
                    {[ClassLevel.CLASS_3, ClassLevel.CLASS_4, ClassLevel.CLASS_5].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setSelectedClass(level)}
                        className={`py-4 rounded-2xl font-black text-xl transition-all border-4 ${
                          selectedClass === level 
                            ? 'bg-sky-500 border-sky-300 text-white shadow-lg scale-105' 
                            : 'bg-white border-slate-100 text-slate-400'
                        }`}
                      >
                        Class {level}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Emoji Picker */}
              <div>
                <div className="flex justify-between items-end mb-4 px-2">
                  <label className="block text-slate-700 font-black text-lg uppercase tracking-wide">Choose an Emoji</label>
                  {!isCustom && <span className="text-sky-500 font-bold text-sm">Active Choice</span>}
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                  {GIVEN_AVATARS.map((emoji) => {
                    const isSelected = avatar === emoji && !isCustom;
                    return (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => handleEmojiSelect(emoji)}
                        className={`w-full aspect-square flex items-center justify-center text-3xl md:text-4xl rounded-2xl transition-all relative ${
                          isSelected 
                            ? 'bg-sky-500 text-white shadow-xl scale-110 rotate-3 ring-4 ring-sky-300 ring-offset-2' 
                            : 'bg-white border-2 border-slate-100 hover:bg-sky-50 hover:scale-105'
                        }`}
                      >
                        {emoji}
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] border-2 border-white shadow-md">
                            ✓
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={isSuccess}
                  className={`w-full py-6 rounded-[2.5rem] font-black text-3xl shadow-2xl transition-all transform active:scale-95 ${
                    isSuccess 
                      ? 'bg-green-500 text-white cursor-default' 
                      : 'bg-sky-500 hover:bg-sky-600 text-white hover:-translate-y-1'
                  }`}
                >
                  {isSuccess ? (
                    <span className="flex items-center justify-center space-x-3">
                      <span>Saved!</span>
                      <span className="text-4xl animate-bounce">✨</span>
                    </span>
                  ) : (
                    'Update My Profile 🚀'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Helper text */}
        <p className="text-center mt-8 text-slate-400 font-bold text-sm">
          Tip: You can change your name, class, and photo as many times as you like!
        </p>
      </div>
    </div>
  );
};

export default Profile;