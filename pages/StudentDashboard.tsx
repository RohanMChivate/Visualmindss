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
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [quizScore, setQuizScore] = useState<{ score: number, total: number } | null>(null);

  // Strictly filter chapters based on user's class (e.g., Class 4 only sees Chimpu Monkey)
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
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      return url.replace('youtu.be/', 'youtube.com/embed/');
    }
    return url;
  };

  const isYouTube = (url: string) => url.includes('youtube.com') || url.includes('youtu.be');

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
                  setActiveQuiz(null);
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
                  <div key={map.id} className="bg-white rounded-[2.5rem] p-8 shadow-xl border-4 border-white hover:shadow-2xl transition-all text-center">
                    <div className="w-24 h-24 bg-rose-100 rounded-[2rem] mx-auto flex items-center justify-center text-5xl mb-6 shadow-inner">
                      {map.type === 'pdf' ? '📄' : '🖼️'}
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 leading-tight mb-2">{map.title}</h3>
                    <a href={map.url} target="_blank" rel="noopener noreferrer" className="inline-block bg-rose-500 hover:bg-rose-600 text-white font-black py-4 px-10 rounded-3xl transition-all shadow-xl hover:scale-105 active:scale-95 text-lg">
                      View Map
                    </a>
                  </div>
                )) : <EmptyState icon="🧠" message="Mind maps for this chapter are coming soon!" />}
              </div>
            )}

            {activeTab === 'quizzes' && (
              <div className="grid grid-cols-1 gap-8">
                {content.quizzes.length > 0 ? content.quizzes.map((quiz: Quiz) => (
                  <div key={quiz.id} className="bg-white rounded-[3rem] p-8 shadow-xl flex flex-col md:flex-row items-center justify-between border-4 border-white hover:shadow-2xl transition-all">
                    <div className="flex items-center space-x-8">
                      <div className="w-20 h-20 bg-amber-100 rounded-[2rem] flex items-center justify-center text-4xl shadow-inner shrink-0">📝</div>
                      <div>
                        <h3 className="text-3xl font-black text-slate-800 leading-tight">{quiz.title}</h3>
                        <p className="text-slate-500 font-bold mt-1 uppercase text-xs tracking-widest">{quiz.questions.length} Questions</p>
                      </div>
                    </div>
                    <div className="mt-6 md:mt-0 flex items-center space-x-6">
                      {currentUser?.progress.quizScores[quiz.id] !== undefined && (
                        <div className="text-center bg-slate-50 px-6 py-3 rounded-3xl border-2 border-slate-100">
                          <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">SCORE</span>
                          <span className="text-3xl font-black text-sky-600">{currentUser?.progress.quizScores[quiz.id]}%</span>
                        </div>
                      )}
                      <button onClick={() => setActiveQuiz(quiz)} className="bg-amber-500 hover:bg-amber-600 text-white font-black py-5 px-10 rounded-[2rem] shadow-xl transition-all hover:scale-105 active:scale-95 text-xl">
                        Start! 🎯
                      </button>
                    </div>
                  </div>
                )) : <EmptyState icon="🎯" message="No quizzes available for this chapter yet." />}
              </div>
            )}
          </div>
        </div>

        {selectedVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
            <div className="bg-white w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-2xl relative">
              <button onClick={() => setSelectedVideo(null)} className="absolute top-6 right-6 z-10 w-12 h-12 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center text-2xl border-2 border-white/50">✕</button>
              <div className="aspect-video bg-black">
                {isYouTube(selectedVideo.url) ? (
                  <iframe 
                    src={getEmbedUrl(selectedVideo.url)} 
                    className="w-full h-full" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    onLoad={() => handleVideoComplete(selectedVideo.id)}
                  ></iframe>
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