
import React, { useMemo } from 'react';
import { VideoContent, Quiz } from '../types';

interface Props {
  store: any;
}

const ProgressTracker: React.FC<Props> = ({ store }) => {
  const { currentUser, videos, quizzes, chapters } = store;
  const currentClass = currentUser.selectedClass;

  const stats = useMemo(() => {
    const classVideos = videos.filter((v: VideoContent) => v.classLevel === currentClass);
    const classQuizzes = quizzes.filter((q: Quiz) => q.classLevel === currentClass);
    
    const watchedCount = currentUser.progress.watchedVideos.filter((id: string) => 
      classVideos.some((v: VideoContent) => v.id === id)
    ).length;

    const attemptedQuizzes = Object.keys(currentUser.progress.quizScores).filter(id => 
      classQuizzes.some((q: Quiz) => q.id === id)
    );

    const videoProgress = classVideos.length > 0 ? (watchedCount / classVideos.length) * 100 : 0;
    const quizProgress = classQuizzes.length > 0 ? (attemptedQuizzes.length / classQuizzes.length) * 100 : 0;
    
    return {
      watchedCount,
      totalVideos: classVideos.length,
      attemptedCount: attemptedQuizzes.length,
      totalQuizzes: classQuizzes.length,
      videoProgress,
      quizProgress,
      overallProgress: (videoProgress + quizProgress) / 2
    };
  }, [currentUser, videos, quizzes, currentClass]);

  return (
    <div className="min-h-screen bg-sky-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-black text-slate-800 mb-2">My Learning Journey 🚀</h1>
          <p className="text-xl text-slate-500 font-medium">You are doing a fantastic job, {currentUser.name}!</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Main Progress Circle */}
          <div className="bg-white p-8 rounded-[3rem] shadow-xl flex flex-col items-center justify-center text-center border-b-8 border-sky-100">
            <div className="relative w-48 h-48 flex items-center justify-center mb-6">
              <svg className="w-full h-full -rotate-90">
                <circle cx="96" cy="96" r="88" fill="transparent" stroke="#f1f5f9" strokeWidth="16" />
                <circle cx="96" cy="96" r="88" fill="transparent" stroke="#0ea5e9" strokeWidth="16" strokeDasharray={552.92} strokeDashoffset={552.92 - (552.92 * stats.overallProgress) / 100} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-slate-800">{Math.round(stats.overallProgress)}%</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mastery</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Overall Progress</h2>
            <p className="text-slate-500 mt-2">Keep it up! Almost there!</p>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-[2.5rem] shadow-lg border-l-8 border-amber-400">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-2xl">🎥</div>
                  <h3 className="text-xl font-bold text-slate-800">Video Expert</h3>
                </div>
                <span className="text-amber-600 font-black">{stats.watchedCount}/{stats.totalVideos}</span>
              </div>
              <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 transition-all duration-1000" style={{ width: `${stats.videoProgress}%` }}></div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] shadow-lg border-l-8 border-green-400">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-2xl">🎯</div>
                  <h3 className="text-xl font-bold text-slate-800">Quiz Master</h3>
                </div>
                <span className="text-green-600 font-black">{stats.attemptedCount}/{stats.totalQuizzes}</span>
              </div>
              <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-400 transition-all duration-1000" style={{ width: `${stats.quizProgress}%` }}></div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] shadow-lg border-l-8 border-sky-400">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 bg-sky-100 rounded-2xl flex items-center justify-center text-2xl">🎖️</div>
                <h3 className="text-xl font-bold text-slate-800">Current Rank</h3>
              </div>
              <p className="text-sky-600 font-black text-2xl ml-1">Learning Explorer</p>
              <p className="text-slate-400 text-sm ml-1">Next rank: Knowledge Wizard 🧙‍♂️</p>
            </div>
          </div>
        </div>

        {/* Detailed Quiz History */}
        <div className="bg-white p-8 rounded-[3rem] shadow-xl border">
          <h2 className="text-2xl font-black text-slate-800 mb-6">Quiz Hall of Fame 🏆</h2>
          <div className="space-y-4">
            {Object.entries(currentUser.progress.quizScores).length > 0 ? (
              Object.entries(currentUser.progress.quizScores).map(([id, scoreValue]) => {
                const score = scoreValue as number;
                const quiz = quizzes.find((q: Quiz) => q.id === id);
                if (!quiz) return null;
                return (
                  <div key={id} className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl border-2 border-slate-100">
                    <div className="flex items-center space-x-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${score > 80 ? 'bg-yellow-400 text-white shadow-lg' : 'bg-white'}`}>
                        {score > 80 ? '🥇' : '🥈'}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{quiz.title}</h4>
                        <p className="text-xs text-slate-400 uppercase font-black tracking-widest">Class {quiz.classLevel}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-3xl font-black ${score > 70 ? 'text-green-500' : 'text-amber-500'}`}>{score}%</span>
                      <p className="text-xs text-slate-400 font-bold">Best Score</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10">
                <p className="text-slate-400 font-medium text-lg italic">No quizzes attempted yet. Let's start one! 📝</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
