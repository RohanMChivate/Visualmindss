import React, { useState, useMemo } from 'react';
import { ClassLevel, VideoContent, MindMap, Quiz, Chapter } from '../types';

interface Props {
  store: any;
}

const StudentDashboard: React.FC<Props> = ({ store }) => {
  const { currentUser, videos, mindMaps, quizzes, chapters, updateProgress } = store;
  const currentClass = currentUser?.selectedClass;

  const [activeTab, setActiveTab] = useState<'videos' | 'maps' | 'quizzes'>('videos');
  const [selectedVideo, setSelectedVideo] = useState<VideoContent | null>(null);
  const [selectedMap, setSelectedMap] = useState<MindMap | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [showQuizWarning, setShowQuizWarning] = useState<Quiz | null>(null);
  const [quizScore, setQuizScore] = useState<{ score: number, total: number } | null>(null);

  const filteredChapters = useMemo(() => 
    chapters.filter((c: Chapter) => c.classLevel === currentClass),
    [chapters, currentClass]
  );

  const content = useMemo(() => {
    const chapterIds = filteredChapters.map((c: Chapter) => c.id);
    return {
      videos: videos.filter((v: VideoContent) => chapterIds.includes(v.chapterId)),
      maps: mindMaps.filter((m: MindMap) => chapterIds.includes(m.chapterId)),
      quizzes: quizzes.filter((q: Quiz) => chapterIds.includes(q.chapterId))
    };
  }, [videos, mindMaps, quizzes, filteredChapters]);

  const handleVideoComplete = (videoId: string) => {
    updateProgress(videoId);
  };

  const handleQuizSubmit = (quiz: Quiz, answers: number[]) => {
    let score = 0;
    quiz.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) score++;
    });
    const percentage = Math.round((score / quiz.questions.length) * 100);
    updateProgress(undefined, { quizId: quiz.id, score: percentage });
    setQuizScore({ score, total: quiz.questions.length });
  };

  const isAvatarUrl = currentUser?.avatar && (currentUser.avatar.startsWith('data:') || currentUser.avatar.startsWith('http'));

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/');
    if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'youtube.com/embed/');
    return url;
  };

  const isYouTube = (url: string) => url.includes('youtube.com') || url.includes('youtu.be');

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 4));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 1));
  const handleReset = () => setZoomLevel(1);

  return (
    <div className="min-h-screen bg-sky-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 space-y-6 md:space-y-0">
          <div className="flex items-center space-x-5">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-[2rem] flex items-center justify-center overflow-hidden border-4 border-white shadow-xl transform -rotate-3 hover:rotate-0 transition-transform shrink-0">
              {isAvatarUrl ? (
                <img src={currentUser?.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl">{currentUser?.avatar || '😊'}</span>
              )}
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight">
                Hi, {currentUser?.name}! 👋
              </h1>
              <p className="text-sky-600 font-bold text-lg mt-1 bg-sky-100/50 inline-block px-3 py-1 rounded-xl">
                Class {currentClass} Learning Explorer
              </p>
            </div>
          </div>
          
          <div className="flex bg-white p-2 rounded-2xl shadow-lg space-x-2 border-2 border-slate-100">
            {(['videos', 'maps', 'quizzes'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSelectedVideo(null);
                  setSelectedMap(null);
                  setActiveQuiz(null);
                  setShowQuizWarning(null);
                  setQuizScore(null);
                }}
                className={`px-5 py-2.5 rounded-xl font-black capitalize transition-all flex items-center space-x-2 ${
                  activeTab === tab ? 'bg-sky-500 text-white shadow-lg scale-105' : 'text-slate-500 hover:bg-sky-50'
                }`}
              >
                <span>{tab === 'videos' ? '🎥' : tab === 'maps' ? '🧠' : '📝'}</span>
                <span className="hidden sm:inline">{tab}</span>
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <h2 className="text-xl font-black text-slate-700 mb-4 px-2 uppercase tracking-widest text-sm">Your Lesson</h2>
            <div className="space-y-3">
              {filteredChapters.map((chapter: Chapter) => (
                <div key={chapter.id} className="p-5 bg-white rounded-[1.5rem] shadow-md border-b-4 border-sky-400">
                  <span className="text-xs font-black text-sky-500 uppercase tracking-widest">Selected Chapter</span>
                  <h3 className="font-black text-slate-800 mt-1 text-lg leading-tight">{chapter.name}</h3>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            {activeTab === 'videos' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {content.videos.length > 0 ? content.videos.map((video: VideoContent) => (
                  <div key={video.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white hover:shadow-2xl transition-all cursor-pointer group" onClick={() => setSelectedVideo(video)}>
                    <div className="aspect-video bg-slate-800 flex items-center justify-center text-white relative">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                        <span className="text-4xl">▶️</span>
                      </div>
                      {currentUser?.progress.watchedVideos.includes(video.id) && (
                        <div className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-2xl shadow-lg border-2 border-white flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                          <span className="text-xs font-black">DONE</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-black text-slate-800 leading-tight">{video.title}</h3>
                      <p className="text-slate-500 mt-2 font-medium">Click to learn! 🎒</p>
                    </div>
                  </div>
                )) : <EmptyState icon="🎞️" message={`No videos added for your chapter yet.`} />}
              </div>
            )}

            {activeTab === 'maps' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {content.maps.length > 0 ? content.maps.map((map: MindMap) => (
                  <div key={map.id} className="bg-white rounded-[2.5rem] p-8 shadow-xl border-4 border-white hover:shadow-2xl transition-all text-center flex flex-col justify-between">
                    <div>
                      <div className="w-24 h-24 bg-rose-100 rounded-[2rem] mx-auto flex items-center justify-center text-5xl mb-6 shadow-inner">
                        {map.type === 'pdf' ? '📄' : '🖼️'}
                      </div>
                      <h3 className="text-2xl font-black text-slate-800 leading-tight mb-2">{map.title}</h3>
                      <p className="text-slate-400 font-bold text-sm mb-6 uppercase tracking-wider">{map.type === 'pdf' ? 'PDF Document' : 'Image Map'}</p>
                    </div>
                    <button 
                      onClick={() => { setSelectedMap(map); setZoomLevel(1); }}
                      className="inline-block bg-rose-500 hover:bg-rose-600 text-white font-black py-4 px-10 rounded-3xl transition-all shadow-xl hover:scale-105 active:scale-95 text-lg"
                    >
                      View Map
                    </button>
                  </div>
                )) : <EmptyState icon="🧠" message="Mind maps for this chapter are coming soon!" />}
              </div>
            )}

            {activeTab === 'quizzes' && (
              <div className="grid grid-cols-1 gap-8">
                {content.quizzes.length > 0 ? content.quizzes.map((quiz: Quiz) => {
                  const alreadyTaken = currentUser?.progress.quizScores[quiz.id] !== undefined;
                  return (
                    <div key={quiz.id} className={`bg-white rounded-[3rem] p-8 shadow-xl flex flex-col md:flex-row items-center justify-between border-4 border-white transition-all ${alreadyTaken ? 'opacity-80' : 'hover:shadow-2xl'}`}>
                      <div className="flex items-center space-x-8">
                        <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center text-4xl shadow-inner shrink-0 ${alreadyTaken ? 'bg-green-100' : 'bg-amber-100'}`}>
                          {alreadyTaken ? '✅' : '📝'}
                        </div>
                        <div>
                          <h3 className="text-3xl font-black text-slate-800 leading-tight">{quiz.title}</h3>
                          <div className="flex items-center space-x-3 mt-1">
                            <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">{quiz.questions.length} Questions</p>
                            {alreadyTaken && <span className="text-green-600 font-black text-[10px] uppercase bg-green-50 px-2 py-0.5 rounded-lg border border-green-200">Attempted</span>}
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 md:mt-0 flex items-center space-x-6">
                        {alreadyTaken ? (
                          <div className="text-center bg-slate-50 px-8 py-4 rounded-[2rem] border-2 border-slate-100 shadow-inner">
                            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">YOUR FINAL SCORE</span>
                            <span className="text-4xl font-black text-green-600">{currentUser?.progress.quizScores[quiz.id]}%</span>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setShowQuizWarning(quiz)} 
                            className="bg-amber-500 hover:bg-amber-600 text-white font-black py-5 px-10 rounded-[2rem] shadow-xl transition-all hover:scale-105 active:scale-95 text-xl"
                          >
                            Start! 🎯
                          </button>
                        )}
                      </div>
                    </div>
                  );
                }) : <EmptyState icon="🎯" message="No quizzes available for this chapter yet." />}
              </div>
            )}
          </div>
        </div>

        {/* Video Player Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
            <div className="bg-white w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-2xl relative">
              <button onClick={() => setSelectedVideo(null)} className="absolute top-6 right-6 z-10 w-12 h-12 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center text-2xl border-2 border-white/50">✕</button>
              <div className="aspect-video bg-black">
                {isYouTube(selectedVideo.url) ? (
                  <iframe src={getEmbedUrl(selectedVideo.url)} className="w-full h-full" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen onLoad={() => handleVideoComplete(selectedVideo.id)}></iframe>
                ) : (
                  <video controls className="w-full h-full" onEnded={() => handleVideoComplete(selectedVideo.id)} autoPlay>
                    <source src={selectedVideo.url} />
                  </video>
                )}
              </div>
              <div className="p-8 flex justify-between items-center">
                <h2 className="text-3xl font-black text-slate-800">{selectedVideo.title}</h2>
                <div className="bg-sky-100 text-sky-600 px-4 py-2 rounded-xl font-bold text-sm">Learning in Progress ✨</div>
              </div>
            </div>
          </div>
        )}

        {/* Mind Map Viewer Modal with Robust Zoom Controls */}
        {selectedMap && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
            <div className="bg-white w-full max-w-5xl h-[90vh] rounded-[3.5rem] overflow-hidden shadow-2xl relative flex flex-col border-4 border-slate-900">
              {/* Close Button */}
              <button 
                onClick={() => setSelectedMap(null)} 
                className="absolute top-6 right-6 z-50 w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center text-2xl shadow-xl hover:scale-110 active:scale-90 transition-all border-2 border-white/20"
              >
                ✕
              </button>
              
              <div className="p-8 bg-white border-b border-slate-100 shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div>
                  <h2 className="text-3xl font-black text-slate-800 leading-tight">{selectedMap.title}</h2>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="bg-sky-100 text-sky-600 font-black text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-lg">Study Material</span>
                    <span className="bg-slate-100 text-slate-500 font-black text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-lg">
                      {selectedMap.type === 'pdf' ? 'PDF Document' : `Zoom: ${Math.round(zoomLevel * 100)}%`}
                    </span>
                  </div>
                </div>
                
                {selectedMap.type !== 'pdf' && (
                  <div className="flex bg-slate-900 p-2 rounded-2xl space-x-3 border-2 border-slate-800 shadow-xl z-10">
                    <button 
                      onClick={handleZoomOut}
                      disabled={zoomLevel <= 1}
                      className="w-12 h-12 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-white rounded-xl flex items-center justify-center shadow-inner transition-all group"
                      title="Zoom Out"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M20 12H4"></path></svg>
                    </button>
                    <button 
                      onClick={handleReset}
                      className="px-6 h-12 bg-slate-800 hover:bg-slate-700 text-white rounded-xl flex items-center justify-center shadow-inner transition-all font-black text-xs uppercase tracking-widest border border-slate-700"
                      title="Reset View"
                    >
                      Reset
                    </button>
                    <button 
                      onClick={handleZoomIn}
                      className="w-12 h-12 bg-slate-800 hover:bg-slate-700 text-white rounded-xl flex items-center justify-center shadow-inner transition-all group"
                      title="Zoom In"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M12 4v16m8-8H4"></path></svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Viewer Content */}
              <div className="flex-grow overflow-auto p-0 bg-slate-100 relative group flex items-start justify-center">
                {selectedMap.type === 'pdf' ? (
                  <iframe 
                    src={selectedMap.url} 
                    className="w-full h-full bg-white shadow-inner" 
                    title={selectedMap.title}
                  />
                ) : (
                  <div className="min-w-full min-h-full flex items-center justify-center p-8">
                    <img 
                      src={selectedMap.url} 
                      alt={selectedMap.title} 
                      style={{ 
                        transform: `scale(${zoomLevel})`,
                        transformOrigin: 'center center',
                        transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                      }}
                      className="max-w-full max-h-full object-contain rounded-lg shadow-2xl bg-white border-2 border-white" 
                    />
                  </div>
                )}
                
                {selectedMap.type !== 'pdf' && zoomLevel > 1 && (
                  <div className="fixed bottom-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-8 py-4 rounded-full text-xs font-black backdrop-blur-md pointer-events-none shadow-2xl border-2 border-white/10 z-50">
                    Scroll to Pan & Explore 🗺️
                  </div>
                )}
              </div>

              <div className="p-6 bg-slate-50 shrink-0 text-center border-t border-slate-100">
                <button 
                  onClick={() => setSelectedMap(null)}
                  className="bg-slate-900 text-white font-black px-12 py-4 rounded-2xl hover:bg-slate-800 transition-all text-lg shadow-lg hover:-translate-y-1 active:scale-95"
                >
                  Finished Reviewing
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ONE TIME QUIZ WARNING MODAL */}
        {showQuizWarning && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-[3.5rem] p-10 text-center shadow-2xl border-4 border-amber-400 animate-in zoom-in duration-300">
              <div className="text-8xl mb-6">⚠️</div>
              <h2 className="text-3xl font-black text-slate-800 mb-4">Wait a second!</h2>
              <div className="bg-amber-50 p-6 rounded-3xl border-2 border-amber-100 mb-8">
                <p className="text-slate-700 font-bold text-lg leading-relaxed">
                  You can only take this quiz <span className="text-amber-600 font-black">ONE TIME</span>. 
                </p>
                <p className="text-slate-500 text-sm mt-2">
                  Once you start, your first score will be saved forever. Are you ready?
                </p>
              </div>
              <div className="flex flex-col space-y-4">
                <button 
                  onClick={() => { setActiveQuiz(showQuizWarning); setShowQuizWarning(null); }} 
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black py-5 rounded-[2rem] shadow-xl transition-all hover:scale-105 active:scale-95 text-2xl animate-pulse"
                >
                  Yes, I'm Ready! 🚀
                </button>
                <button 
                  onClick={() => setShowQuizWarning(null)} 
                  className="w-full py-4 text-slate-400 font-bold hover:text-slate-600 transition-colors"
                >
                  Maybe later...
                </button>
              </div>
            </div>
          </div>
        )}

        {activeQuiz && !quizScore && (
          <QuizSession quiz={activeQuiz} onSubmit={(answers) => handleQuizSubmit(activeQuiz, answers)} onCancel={() => setActiveQuiz(null)} />
        )}

        {quizScore && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-[4rem] p-12 text-center shadow-2xl">
              <div className="text-9xl mb-8 animate-bounce">{quizScore.score === quizScore.total ? '🏆' : '⭐'}</div>
              <h2 className="text-5xl font-black text-slate-800 mb-4">Well Done!</h2>
              <p className="text-2xl text-slate-500 font-bold mb-10">You scored <span className="text-sky-600 font-black">{quizScore.score}</span> / {quizScore.total}</p>
              <button onClick={() => { setQuizScore(null); setActiveQuiz(null); }} className="w-full bg-sky-500 hover:bg-sky-600 text-white font-black py-6 rounded-[2.5rem] shadow-xl transition-all text-3xl">Great! 🎉</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const QuizSession: React.FC<{ quiz: Quiz, onSubmit: (answers: number[]) => void, onCancel: () => void }> = ({ quiz, onSubmit, onCancel }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const handleSelect = (idx: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIdx] = idx;
    setAnswers(newAnswers);
  };
  const isLast = currentIdx === quiz.questions.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-500/95 overflow-y-auto backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-[3.5rem] p-10 shadow-2xl relative">
        <button onClick={onCancel} className="absolute top-10 right-10 text-slate-300 hover:text-slate-500 text-xl font-black">✕</button>
        <div className="mb-10 text-center">
          <span className="text-xs font-black text-sky-500 uppercase tracking-widest">Question {currentIdx + 1} of {quiz.questions.length}</span>
          <h2 className="text-3xl font-black text-slate-800 mt-4 leading-tight">{quiz.questions[currentIdx].text}</h2>
        </div>
        <div className="space-y-4 mb-12">
          {quiz.questions[currentIdx].options.map((opt, i) => (
            <button key={i} onClick={() => handleSelect(i)} className={`w-full p-6 text-left rounded-[2rem] border-4 font-black text-xl transition-all ${answers[currentIdx] === i ? 'bg-sky-50 border-sky-400 text-sky-700 shadow-lg scale-[1.02]' : 'bg-white border-slate-100 hover:border-slate-200 text-slate-600'}`}>
              <span className={`inline-block w-10 h-10 rounded-2xl mr-4 text-center leading-10 font-black ${answers[currentIdx] === i ? 'bg-sky-500 text-white' : 'bg-slate-100'}`}>{String.fromCharCode(65 + i)}</span>
              {opt}
            </button>
          ))}
        </div>
        <div className="flex space-x-6">
          <button disabled={currentIdx === 0} onClick={() => setCurrentIdx(prev => prev - 1)} className="flex-1 py-5 bg-slate-100 text-slate-400 font-black rounded-[1.5rem] disabled:opacity-30">Back</button>
          <button disabled={answers[currentIdx] === undefined} onClick={() => isLast ? onSubmit(answers) : setCurrentIdx(prev => prev + 1)} className={`flex-1 py-5 text-white font-black rounded-[1.5rem] shadow-xl ${answers[currentIdx] === undefined ? 'bg-slate-300' : 'bg-sky-500 hover:bg-sky-600'}`}>
            {isLast ? 'Finish! 🏁' : 'Next ➡'}
          </button>
        </div>
      </div>
    </div>
  );
};

const EmptyState: React.FC<{ icon: string, message: string }> = ({ icon, message }) => (
  <div className="col-span-full py-24 bg-white rounded-[4rem] border-4 border-dashed border-slate-100 text-center shadow-inner">
    <div className="text-8xl mb-8 opacity-20">{icon}</div>
    <p className="text-3xl font-black text-slate-300 tracking-tight">{message}</p>
  </div>
);

export default StudentDashboard;