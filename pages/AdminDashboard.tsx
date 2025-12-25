
import React, { useState } from 'react';
import { ClassLevel, VideoContent, MindMap, Quiz, Question, User, UserRole, Chapter } from '../types';

interface Props {
  store: any;
}

const AdminDashboard: React.FC<Props> = ({ store }) => {
  const { users, videos, mindMaps, quizzes, chapters, addContent, removeContent, editContent } = store;
  const [activeTab, setActiveTab] = useState<'library' | 'students'>('library');
  const [showAddModal, setShowAddModal] = useState<'video' | 'map' | 'quiz' | null>(null);
  const [editingItem, setEditingItem] = useState<{ type: 'video' | 'map' | 'quiz', data: any } | null>(null);
  const [selectedStudentReport, setSelectedStudentReport] = useState<User | null>(null);

  const handleDelete = (type: 'video' | 'map' | 'quiz', id: string, title: string) => {
    if (confirm(`⚠️ DELETE CONTENT\n\nAre you sure you want to remove "${title}"?\n\nThis will permanently delete this lesson for all students.`)) {
      removeContent(type, id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 text-slate-800">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-4xl font-black text-slate-900 leading-tight">Teacher Admin Hub 🛠️</h1>
            <p className="text-slate-500 text-lg font-medium">Control the library, add lessons, or remove content.</p>
          </div>
          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
            <button 
              onClick={() => setActiveTab('library')} 
              className={`px-8 py-2.5 rounded-xl font-black transition-all ${activeTab === 'library' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              Content Manager
            </button>
            <button 
              onClick={() => setActiveTab('students')} 
              className={`px-8 py-2.5 rounded-xl font-black transition-all ${activeTab === 'students' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              Student Progress
            </button>
          </div>
        </header>

        {activeTab === 'library' ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button onClick={() => setShowAddModal('video')} className="p-6 bg-white rounded-3xl border-2 border-slate-100 hover:border-sky-500 group transition-all text-left shadow-sm">
                <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">🎥</div>
                <h3 className="text-xl font-black text-slate-800">Add New Video</h3>
                <p className="text-slate-400 font-medium text-sm">Upload a lesson video.</p>
              </button>
              <button onClick={() => setShowAddModal('map')} className="p-6 bg-white rounded-3xl border-2 border-slate-100 hover:border-rose-500 group transition-all text-left shadow-sm">
                <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">🧠</div>
                <h3 className="text-xl font-black text-slate-800">Add Mind Map</h3>
                <p className="text-slate-400 font-medium text-sm">Add a story map or chart.</p>
              </button>
              <button onClick={() => setShowAddModal('quiz')} className="p-6 bg-white rounded-3xl border-2 border-slate-100 hover:border-amber-500 group transition-all text-left shadow-sm">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">📝</div>
                <h3 className="text-xl font-black text-slate-800">Add MCQ Quiz</h3>
                <p className="text-slate-400 font-medium text-sm">Create a new challenge.</p>
              </button>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-md border border-slate-100 overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                <h2 className="text-2xl font-black text-slate-800">Library Content</h2>
                <div className="flex items-center space-x-3">
                    <span className="bg-sky-100 px-3 py-1 rounded-full text-[10px] font-black text-sky-600">{videos.length} Videos</span>
                    <span className="bg-rose-100 px-3 py-1 rounded-full text-[10px] font-black text-rose-600">{mindMaps.length} Maps</span>
                    <span className="bg-amber-100 px-3 py-1 rounded-full text-[10px] font-black text-amber-600">{quizzes.length} Quizzes</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-white text-left border-b">
                      <th className="px-8 py-4 font-black text-slate-400 text-xs uppercase tracking-widest">Type</th>
                      <th className="px-8 py-4 font-black text-slate-400 text-xs uppercase tracking-widest">Resource Title</th>
                      <th className="px-8 py-4 font-black text-slate-400 text-xs uppercase tracking-widest">Chapter / Class</th>
                      <th className="px-8 py-4 font-black text-slate-400 text-xs uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {/* VIDEO SECTION */}
                    {videos.map((v: VideoContent) => (
                      <LibraryRow 
                        key={v.id} 
                        icon="🎥" 
                        title={v.title} 
                        chapter={chapters.find((c: Chapter) => c.id === v.chapterId)?.name || 'Unknown'} 
                        classLevel={v.classLevel}
                        onEdit={() => setEditingItem({ type: 'video', data: v })}
                        onDelete={() => handleDelete('video', v.id, v.title)}
                      />
                    ))}
                    
                    {/* MIND MAP SECTION */}
                    {mindMaps.map((m: MindMap) => (
                      <LibraryRow 
                        key={m.id} 
                        icon="🧠" 
                        title={m.title} 
                        chapter={chapters.find((c: Chapter) => c.id === m.chapterId)?.name || 'Unknown'} 
                        classLevel={m.classLevel}
                        onEdit={() => setEditingItem({ type: 'map', data: m })}
                        onDelete={() => handleDelete('map', m.id, m.title)}
                      />
                    ))}

                    {/* QUIZ SECTION */}
                    {quizzes.map((q: Quiz) => (
                      <LibraryRow 
                        key={q.id} 
                        icon="📝" 
                        title={q.title} 
                        chapter={chapters.find((c: Chapter) => c.id === q.chapterId)?.name || 'Unknown'} 
                        classLevel={q.classLevel}
                        onEdit={() => setEditingItem({ type: 'quiz', data: q })}
                        onDelete={() => handleDelete('quiz', q.id, q.title)}
                      />
                    ))}

                    {videos.length === 0 && mindMaps.length === 0 && quizzes.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-24 text-center">
                            <div className="text-6xl mb-4">📭</div>
                            <p className="text-slate-400 font-black text-xl">Your library is empty.</p>
                            <p className="text-slate-300 font-bold">Start adding lessons using the buttons above!</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] shadow-md border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-50">
              <h2 className="text-2xl font-black text-slate-800">Student Progress Tracker</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b">
                    <th className="px-8 py-6 font-black text-slate-400 uppercase text-xs tracking-[0.2em]">Student</th>
                    <th className="px-8 py-6 font-black text-slate-400 uppercase text-xs tracking-[0.2em]">Class</th>
                    <th className="px-8 py-6 font-black text-slate-400 uppercase text-xs tracking-[0.2em]">Watched</th>
                    <th className="px-8 py-6 font-black text-slate-400 uppercase text-xs tracking-[0.2em]">Avg Score</th>
                    <th className="px-8 py-6 font-black text-slate-400 uppercase text-xs tracking-[0.2em] text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users.filter((u: User) => u.role === UserRole.STUDENT).map((student: User) => {
                    const quizCount = Object.keys(student.progress.quizScores).length;
                    const totalScore = Object.values(student.progress.quizScores).reduce((a, b) => (a as number) + (b as number), 0) as number;
                    const avgScore = quizCount > 0 ? Math.round(totalScore / quizCount) : 0;
                    const isAvatarUrl = student.avatar && (student.avatar.startsWith('data:') || student.avatar.startsWith('http'));

                    return (
                      <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm shrink-0">
                              {isAvatarUrl ? (
                                <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-2xl">{student.avatar || '😊'}</span>
                              )}
                            </div>
                            <div>
                              <p className="font-black text-slate-900 leading-none mb-1">{student.name}</p>
                              <p className="text-xs text-slate-400 font-medium uppercase tracking-tighter">{student.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="px-4 py-1 bg-sky-100 text-sky-700 rounded-full font-black text-[10px] uppercase">
                            {student.selectedClass ? `Class ${student.selectedClass}` : 'NO CLASS'}
                          </span>
                        </td>
                        <td className="px-8 py-6 font-bold text-slate-500">
                          🎬 {student.progress.watchedVideos.length} Videos
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center space-x-3">
                            <span className={`text-lg font-black ${avgScore > 75 ? 'text-green-500' : avgScore > 40 ? 'text-amber-500' : 'text-slate-400'}`}>
                              {avgScore}%
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button 
                            onClick={() => setSelectedStudentReport(student)}
                            className="bg-slate-900 text-white px-4 py-2 rounded-xl font-black text-xs hover:bg-slate-800 transition-colors"
                          >
                            View Report
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showAddModal === 'video' && <AddVideoModal onAdd={(v) => { addContent('video', v); setShowAddModal(null); }} onCancel={() => setShowAddModal(null)} chapters={chapters} />}
        {showAddModal === 'map' && <AddMapModal onAdd={(m) => { addContent('map', m); setShowAddModal(null); }} onCancel={() => setShowAddModal(null)} chapters={chapters} />}
        {showAddModal === 'quiz' && <AddQuizModal onAdd={(q) => { addContent('quiz', q); setShowAddModal(null); }} onCancel={() => setShowAddModal(null)} chapters={chapters} />}

        {editingItem && (
          <EditContentModal 
            type={editingItem.type} 
            item={editingItem.data} 
            chapters={chapters}
            onSave={(updated) => { editContent(editingItem.type, editingItem.data.id, updated); setEditingItem(null); }}
            onCancel={() => setEditingItem(null)}
          />
        )}

        {selectedStudentReport && (
          <StudentReportModal 
            student={selectedStudentReport} 
            videos={videos} 
            quizzes={quizzes}
            onClose={() => setSelectedStudentReport(null)}
          />
        )}
      </div>
    </div>
  );
};

const LibraryRow: React.FC<{ icon: string, title: string, chapter: string, classLevel: string, onEdit: () => void, onDelete: () => void }> = ({ icon, title, chapter, classLevel, onEdit, onDelete }) => (
  <tr className="hover:bg-slate-50/30 transition-colors group">
    <td className="px-8 py-5">
      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-xl">{icon}</div>
    </td>
    <td className="px-8 py-5">
      <p className="font-black text-slate-800">{title}</p>
    </td>
    <td className="px-8 py-5">
      <p className="text-sm font-bold text-slate-500">{chapter}</p>
      <p className="text-[10px] font-black text-sky-500 uppercase">Class {classLevel}</p>
    </td>
    <td className="px-8 py-5 text-right">
      <div className="flex justify-end space-x-2">
        <button 
            onClick={onEdit} 
            className="p-2.5 bg-slate-100 hover:bg-sky-500 hover:text-white text-slate-500 rounded-xl transition-all shadow-sm" 
            title="Edit"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
        </button>
        <button 
            onClick={onDelete} 
            className="p-2.5 bg-red-50 hover:bg-red-600 hover:text-white text-red-500 rounded-xl transition-all shadow-sm" 
            title="Delete"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        </button>
      </div>
    </td>
  </tr>
);

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const EditContentModal: React.FC<{ type: 'video' | 'map' | 'quiz', item: any, chapters: Chapter[], onSave: (updated: any) => void, onCancel: () => void }> = ({ type, item, chapters, onSave, onCancel }) => {
  const [title, setTitle] = useState(item.title);
  const [chapterId, setChapterId] = useState(item.chapterId);
  const [sourceType, setSourceType] = useState<'url' | 'file'>('url');
  const [url, setUrl] = useState(item.url || '');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const chapter = chapters.find(c => c.id === chapterId);
    
    let finalUrl = url;
    if (sourceType === 'file' && file) {
      try {
        finalUrl = await fileToBase64(file);
      } catch (err) {
        console.error("Base64 conversion failed", err);
        alert("Failed to process file. Please use a URL instead.");
        setIsLoading(false);
        return;
      }
    }

    const updatedItem = {
      ...item,
      title,
      chapterId,
      classLevel: chapter?.classLevel || item.classLevel,
      url: finalUrl
    };

    if (type === 'map') {
      updatedItem.type = (sourceType === 'file' && file) 
        ? (file.type.includes('pdf') ? 'pdf' : 'image')
        : (finalUrl.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image');
    }

    onSave(updatedItem);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <form onSubmit={handleSubmit} className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl border-4 border-white my-8">
        <h2 className="text-3xl font-black text-slate-900 mb-8">Edit {type === 'video' ? 'Video' : type === 'map' ? 'Mind Map' : 'Quiz'}</h2>
        <div className="space-y-6 mb-10">
          <div>
            <label className="block text-slate-700 font-black mb-2 uppercase text-xs tracking-widest">Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-slate-900 focus:outline-none transition-all font-bold text-slate-900" />
          </div>
          <div>
            <label className="block text-slate-700 font-black mb-2 uppercase text-xs tracking-widest">Chapter</label>
            <select value={chapterId} onChange={(e) => setChapterId(e.target.value)} className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-slate-900 focus:outline-none transition-all font-bold text-slate-900">
              {chapters.map(c => <option key={c.id} value={c.id}>{c.name} (Class {c.classLevel})</option>)}
            </select>
          </div>

          {(type === 'video' || type === 'map') && (
            <div className="space-y-4">
              <label className="block text-slate-700 font-black uppercase text-xs tracking-widest">Replace Source</label>
              <div className="bg-slate-50 p-2 rounded-2xl flex space-x-2">
                <button type="button" onClick={() => setSourceType('url')} className={`flex-1 py-2 rounded-xl text-sm font-black transition-all ${sourceType === 'url' ? 'bg-white shadow-sm' : 'text-slate-400'}`}>Link URL</button>
                <button type="button" onClick={() => setSourceType('file')} className={`flex-1 py-2 rounded-xl text-sm font-black transition-all ${sourceType === 'file' ? 'bg-white shadow-sm' : 'text-slate-400'}`}>Upload File</button>
              </div>

              {sourceType === 'url' ? (
                <input 
                  type="url" 
                  value={url} 
                  onChange={(e) => setUrl(e.target.value)} 
                  placeholder="https://..." 
                  className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-slate-900 focus:outline-none transition-all font-bold text-sm text-slate-900" 
                />
              ) : (
                <input 
                  type="file" 
                  accept={type === 'video' ? 'video/*' : 'image/*,.pdf'} 
                  onChange={(e) => setFile(e.target.files?.[0] || null)} 
                  className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-slate-900 focus:outline-none transition-all font-bold text-sm text-slate-900" 
                />
              )}
            </div>
          )}
        </div>
        <div className="flex space-x-4">
          <button type="button" onClick={onCancel} className="flex-1 py-4 font-black text-slate-400">Cancel</button>
          <button type="submit" disabled={isLoading} className="flex-1 py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all">
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

const StudentReportModal: React.FC<{ student: User, videos: VideoContent[], quizzes: Quiz[], onClose: () => void }> = ({ student, videos, quizzes, onClose }) => {
  const isAvatarUrl = student.avatar && (student.avatar.startsWith('data:') || student.avatar.startsWith('http'));
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[3.5rem] p-10 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 text-2xl font-black">✕</button>
        
        <header className="flex items-center space-x-6 mb-12">
          <div className="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center text-5xl overflow-hidden border-4 border-white shadow-lg">
            {isAvatarUrl ? <img src={student.avatar} className="w-full h-full object-cover" /> : <span>{student.avatar || '😊'}</span>}
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900">{student.name}'s Progress</h2>
            <p className="text-sky-600 font-bold tracking-widest uppercase text-xs">Student ID: {student.id}</p>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-slate-50 p-6 rounded-3xl border-2 border-slate-100 text-center">
            <span className="block text-4xl mb-2">🎬</span>
            <span className="block text-2xl font-black text-slate-800">{student.progress.watchedVideos.length}</span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Videos Watched</span>
          </div>
          <div className="bg-slate-50 p-6 rounded-3xl border-2 border-slate-100 text-center">
            <span className="block text-4xl mb-2">🎯</span>
            <span className="block text-2xl font-black text-slate-800">{Object.keys(student.progress.quizScores).length}</span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Quizzes Taken</span>
          </div>
        </div>

        <section className="mb-8">
          <h3 className="text-xl font-black text-slate-800 mb-4 px-2">Quiz Performance</h3>
          <div className="space-y-3">
            {Object.entries(student.progress.quizScores).map(([qId, scoreValue]) => {
              const score = scoreValue as number;
              const quiz = quizzes.find(q => q.id === qId);
              return (
                <div key={qId} className="flex justify-between items-center p-4 bg-white border-2 border-slate-50 rounded-2xl shadow-sm">
                  <span className="font-bold text-slate-600">{quiz?.title || 'Unknown Quiz'}</span>
                  <div className="flex items-center space-x-3">
                    <span className={`font-black ${score >= 80 ? 'text-green-500' : 'text-amber-500'}`}>{score}%</span>
                    <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${score >= 80 ? 'bg-green-500' : 'bg-amber-500'}`} style={{ width: `${score}%` }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
            {Object.keys(student.progress.quizScores).length === 0 && <p className="text-center text-slate-300 py-4 italic">No quizzes attempted yet.</p>}
          </div>
        </section>

        <button 
          onClick={onClose}
          className="w-full py-5 bg-slate-900 text-white font-black rounded-3xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all text-xl"
        >
          Close Report
        </button>
      </div>
    </div>
  );
};

const AddVideoModal: React.FC<{ onAdd: (v: any) => void, onCancel: () => void, chapters: any[] }> = ({ onAdd, onCancel, chapters }) => {
  const [title, setTitle] = useState('');
  const [chapterId, setChapterId] = useState(chapters[0]?.id || '');
  const [uploadType, setUploadType] = useState<'file' | 'url'>('url');
  const [videoUrl, setVideoUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const chapter = chapters.find(c => c.id === chapterId);
    let finalUrl = videoUrl;

    if (uploadType === 'file' && file) {
      try {
        finalUrl = await fileToBase64(file);
      } catch (err) {
        alert("Video too large or invalid. Please use a URL link for better results.");
        setIsLoading(false);
        return;
      }
    }

    if (!finalUrl) {
      alert('Please provide a video source!');
      setIsLoading(false);
      return;
    }

    onAdd({
      id: Math.random().toString(36).substr(2, 9),
      chapterId,
      classLevel: chapter.classLevel,
      title,
      url: finalUrl
    });
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl border-4 border-white">
        <h2 className="text-3xl font-black text-slate-900 mb-8">Add Video 🎥</h2>
        <div className="space-y-5 mb-8">
          <div>
            <label className="block text-slate-700 font-black mb-2 uppercase text-xs tracking-widest">Lesson Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-sky-500 focus:outline-none transition-all font-bold text-slate-900" placeholder="e.g. Chapter 1 Intro" />
          </div>
          <div>
            <label className="block text-slate-700 font-black mb-2 uppercase text-xs tracking-widest">Chapter (Class Level)</label>
            <select value={chapterId} onChange={(e) => setChapterId(e.target.value)} className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-sky-500 focus:outline-none transition-all font-bold text-slate-900">
              {chapters.map(c => <option key={c.id} value={c.id}>{c.name} (Class {c.classLevel})</option>)}
            </select>
          </div>
          
          <div className="bg-slate-50 p-2 rounded-2xl flex space-x-2">
            <button type="button" onClick={() => setUploadType('url')} className={`flex-1 py-2 rounded-xl text-sm font-black transition-all ${uploadType === 'url' ? 'bg-white shadow-sm' : 'text-slate-400'}`}>Link URL</button>
            <button type="button" onClick={() => setUploadType('file')} className={`flex-1 py-2 rounded-xl text-sm font-black transition-all ${uploadType === 'file' ? 'bg-white shadow-sm' : 'text-slate-400'}`}>Local File</button>
          </div>

          {uploadType === 'url' ? (
            <div>
              <label className="block text-slate-700 font-black mb-2 uppercase text-xs tracking-widest">Video URL (Recommended)</label>
              <input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://example.com/video.mp4" className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-sky-500 focus:outline-none transition-all font-bold text-sm text-slate-900" />
            </div>
          ) : (
            <div>
              <label className="block text-slate-700 font-black mb-2 uppercase text-xs tracking-widest">Select File</label>
              <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-sky-500 focus:outline-none transition-all font-bold text-sm text-slate-900" />
            </div>
          )}
        </div>
        <div className="flex space-x-4">
          <button type="button" onClick={onCancel} className="flex-1 py-4 font-black text-slate-400">Cancel</button>
          <button type="submit" disabled={isLoading} className="flex-1 py-4 bg-sky-500 text-white font-black rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all">
            {isLoading ? 'Uploading...' : 'Add Lesson'}
          </button>
        </div>
      </form>
    </div>
  );
};

const AddMapModal: React.FC<{ onAdd: (v: any) => void, onCancel: () => void, chapters: any[] }> = ({ onAdd, onCancel, chapters }) => {
  const [title, setTitle] = useState('');
  const [chapterId, setChapterId] = useState(chapters[0]?.id || '');
  const [uploadType, setUploadType] = useState<'file' | 'url'>('url');
  const [mapUrl, setMapUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const chapter = chapters.find(c => c.id === chapterId);
    let finalUrl = mapUrl;
    let type: 'image' | 'pdf' = 'image';

    if (uploadType === 'file' && file) {
      try {
        finalUrl = await fileToBase64(file);
        type = file.type.includes('pdf') ? 'pdf' : 'image';
      } catch (err) {
        alert("Failed to process file.");
        setIsLoading(false);
        return;
      }
    } else {
      type = mapUrl.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image';
    }

    if (!finalUrl) {
      alert('Please provide a source!');
      setIsLoading(false);
      return;
    }

    onAdd({
      id: Math.random().toString(36).substr(2, 9),
      chapterId,
      classLevel: chapter.classLevel,
      title,
      url: finalUrl,
      type
    });
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl border-4 border-white">
        <h2 className="text-3xl font-black text-slate-900 mb-8">Add Mind Map 🧠</h2>
        <div className="space-y-5 mb-8">
          <div>
            <label className="block text-slate-700 font-black mb-2 uppercase text-xs tracking-widest">Resource Name</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-rose-500 focus:outline-none transition-all font-bold text-slate-900" />
          </div>
          <div>
            <label className="block text-slate-700 font-black mb-2 uppercase text-xs tracking-widest">Chapter</label>
            <select value={chapterId} onChange={(e) => setChapterId(e.target.value)} className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-rose-500 focus:outline-none transition-all font-bold text-slate-900">
              {chapters.map(c => <option key={c.id} value={c.id}>{c.name} (Class {c.classLevel})</option>)}
            </select>
          </div>

          <div className="bg-slate-50 p-2 rounded-2xl flex space-x-2">
            <button type="button" onClick={() => setUploadType('url')} className={`flex-1 py-2 rounded-xl text-sm font-black transition-all ${uploadType === 'url' ? 'bg-white shadow-sm' : 'text-slate-400'}`}>Link URL</button>
            <button type="button" onClick={() => setUploadType('file')} className={`flex-1 py-2 rounded-xl text-sm font-black transition-all ${uploadType === 'file' ? 'bg-white shadow-sm' : 'text-slate-400'}`}>Local File</button>
          </div>

          {uploadType === 'url' ? (
            <input type="url" value={mapUrl} onChange={(e) => setMapUrl(e.target.value)} placeholder="https://example.com/map.jpg" className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-rose-500 focus:outline-none transition-all font-bold text-sm text-slate-900" />
          ) : (
            <input type="file" accept="image/*,.pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-rose-500 focus:outline-none transition-all font-bold text-sm text-slate-900" />
          )}
        </div>
        <div className="flex space-x-4">
          <button type="button" onClick={onCancel} className="flex-1 py-4 font-black text-slate-400">Cancel</button>
          <button type="submit" disabled={isLoading} className="flex-1 py-4 bg-rose-500 text-white font-black rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all">
            {isLoading ? 'Processing...' : 'Upload'}
          </button>
        </div>
      </form>
    </div>
  );
};

const AddQuizModal: React.FC<{ onAdd: (v: any) => void, onCancel: () => void, chapters: any[] }> = ({ onAdd, onCancel, chapters }) => {
  const [title, setTitle] = useState('');
  const [chapterId, setChapterId] = useState(chapters[0]?.id || '');
  const [questions, setQuestions] = useState<Question[]>([]);
  
  const addQuestion = () => {
    setQuestions([...questions, { id: Math.random().toString(36).substr(2, 9), text: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };

  const updateQuestion = (idx: number, field: string, value: any) => {
    const q = [...questions];
    (q[idx] as any)[field] = value;
    setQuestions(q);
  };

  const updateOption = (qIdx: number, oIdx: number, value: string) => {
    const q = [...questions];
    q[qIdx].options[oIdx] = value;
    setQuestions(q);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (questions.length === 0) return alert('Add at least one question!');
    const chapter = chapters.find(c => c.id === chapterId);
    onAdd({
      id: Math.random().toString(36).substr(2, 9),
      chapterId,
      classLevel: chapter.classLevel,
      title,
      questions
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <form onSubmit={handleSubmit} className="bg-white w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl my-10 border-4 border-white">
        <h2 className="text-4xl font-black text-slate-900 mb-8">Build MCQ Quiz 📝</h2>
        <div className="space-y-8 mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-slate-700 font-black mb-2 uppercase text-xs tracking-widest">Quiz Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-amber-500 focus:outline-none transition-all font-bold text-slate-900" />
            </div>
            <div>
              <label className="block text-slate-700 font-black mb-2 uppercase text-xs tracking-widest">Chapter</label>
              <select value={chapterId} onChange={(e) => setChapterId(e.target.value)} className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-amber-500 focus:outline-none transition-all font-bold text-slate-900">
                {chapters.map(c => <option key={c.id} value={c.id}>{c.name} (Class {c.classLevel})</option>)}
              </select>
            </div>
          </div>

          <div className="border-t-4 border-slate-50 pt-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-800">Challenge Steps ({questions.length})</h3>
              <button type="button" onClick={addQuestion} className="bg-amber-100 text-amber-600 px-6 py-3 rounded-2xl font-black text-sm hover:bg-amber-200 transition-all">+ Add Step</button>
            </div>
            <div className="space-y-6">
              {questions.map((q, qIdx) => (
                <div key={q.id} className="p-8 bg-slate-50 rounded-[2.5rem] border-2 border-slate-100 shadow-sm relative">
                  <div className="absolute -top-3 -left-3 bg-slate-800 text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-xs">{qIdx + 1}</div>
                  <input type="text" placeholder={`Question Text`} value={q.text} onChange={(e) => updateQuestion(qIdx, 'text', e.target.value)} required className="w-full px-6 py-3 mb-6 bg-white border-2 border-slate-100 rounded-2xl font-black text-slate-900" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center space-x-3 bg-white p-2 rounded-2xl border border-slate-100">
                        <input type="radio" name={`correct-${q.id}`} checked={q.correctAnswer === oIdx} onChange={() => updateQuestion(qIdx, 'correctAnswer', oIdx)} className="w-5 h-5 accent-amber-500" />
                        <input type="text" placeholder={`Option ${oIdx + 1}`} value={opt} onChange={(e) => updateOption(qIdx, oIdx, e.target.value)} required className="flex-1 px-3 py-1 font-bold text-sm bg-transparent border-none focus:ring-0 text-slate-900" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex space-x-6">
          <button type="button" onClick={onCancel} className="flex-1 py-5 font-black text-slate-400">Cancel</button>
          <button type="submit" className="flex-1 py-5 bg-amber-500 text-white font-black rounded-[2rem] shadow-xl hover:scale-105 active:scale-95 transition-all text-xl">Save Quiz</button>
        </div>
      </form>
    </div>
  );
};

export default AdminDashboard;
