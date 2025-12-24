import { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { User, UserRole, ClassLevel, VideoContent, MindMap, Quiz, Chapter } from './types';
import { INITIAL_CHAPTERS } from './constants';

const STORAGE_KEY = 'visualminds_data_v1';

interface AppData {
  users: User[];
  videos: VideoContent[];
  mindMaps: MindMap[];
  quizzes: Quiz[];
  currentUser: User | null;
}

const initialData: AppData = {
  users: [
    {
      id: 'admin-1',
      name: 'Super Admin',
      email: 'admin@visualminds.com',
      role: UserRole.ADMIN,
      progress: { watchedVideos: [], quizScores: {} }
    }
  ],
  videos: [],
  mindMaps: [],
  quizzes: [],
  currentUser: null
};

// Safe access to process.env for Vite environment
const getApiKey = () => {
  try {
    return (process.env as any).API_KEY;
  } catch {
    return undefined;
  }
};

export const useStore = () => {
  const [data, setData] = useState<AppData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialData;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
  }, [data]);

  const login = (email: string, role: UserRole) => {
    const user = data.users.find(u => u.email === email && u.role === role);
    if (user) {
      setData(prev => ({ ...prev, currentUser: user }));
      return true;
    }
    return false;
  };

  const register = (name: string, email: string) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role: UserRole.STUDENT,
      avatar: '😊',
      progress: { watchedVideos: [], quizScores: {} }
    };
    setData(prev => ({
      ...prev,
      users: [...prev.users, newUser],
      currentUser: newUser
    }));
  };

  const logout = () => {
    setData(prev => ({ ...prev, currentUser: null }));
  };

  const setClass = (classLevel: ClassLevel) => {
    setData(prev => {
      if (!prev.currentUser) return prev;
      const updatedUser = { ...prev.currentUser, selectedClass: classLevel };
      return {
        ...prev,
        users: prev.users.map(u => u.id === updatedUser.id ? updatedUser : u),
        currentUser: updatedUser
      };
    });
  };

  const updateProfile = (name: string, avatar: string) => {
    setData(prev => {
      if (!prev.currentUser) return prev;
      const updatedUser = { ...prev.currentUser, name, avatar };
      return {
        ...prev,
        users: prev.users.map(u => u.id === updatedUser.id ? updatedUser : u),
        currentUser: updatedUser
      };
    });
  };

  const updateProgress = (videoId?: string, quizResult?: { quizId: string, score: number }) => {
    setData(prev => {
      if (!prev.currentUser) return prev;
      const user = prev.users.find(u => u.id === prev.currentUser?.id);
      if (!user) return prev;

      const newProgress = { ...user.progress };
      if (videoId && !newProgress.watchedVideos.includes(videoId)) {
        newProgress.watchedVideos.push(videoId);
      }
      if (quizResult) {
        newProgress.quizScores[quizResult.quizId] = Math.max(
          newProgress.quizScores[quizResult.quizId] || 0,
          quizResult.score
        );
      }

      const updatedUser = { ...user, progress: newProgress };
      return {
        ...prev,
        users: prev.users.map(u => u.id === updatedUser.id ? updatedUser : u),
        currentUser: updatedUser
      };
    });
  };

  const askSparky = async (question: string, contextChapter?: string) => {
    try {
      const apiKey = getApiKey();
      if (!apiKey) {
        return "I need my magic key to answer that! 🪄 (Check environment variables)";
      }

      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `You are Sparky, a friendly and enthusiastic AI tutor for kids aged 8-11 (Classes 3-5). 
      Your tone is magical, encouraging, and very simple. Use emojis. 
      If a kid asks about ${contextChapter || 'their lessons'}, explain it like a fun story. 
      Keep answers short (max 3-4 sentences). Never use complex jargon.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: question,
        config: {
          systemInstruction,
          temperature: 0.8,
        },
      });

      return response.text || "Oops! My magic wand is a bit tired. Can you ask again? ✨";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Oh no! Sparky got a little lost in the clouds. Check your internet! ☁️";
    }
  };

  const addContent = (type: 'video' | 'map' | 'quiz', content: any) => {
    const key = type === 'video' ? 'videos' : type === 'map' ? 'mindMaps' : 'quizzes';
    setData(prev => ({
      ...prev,
      [key]: [...(prev[key] as any[]), content]
    }));
  };

  const removeContent = (type: 'video' | 'map' | 'quiz', id: string) => {
    const key = type === 'video' ? 'videos' : type === 'map' ? 'mindMaps' : 'quizzes';
    setData(prev => ({
      ...prev,
      [key]: (prev[key] as any[]).filter(item => item.id !== id)
    }));
  };

  const editContent = (type: 'video' | 'map' | 'quiz', id: string, updated: any) => {
    const key = type === 'video' ? 'videos' : type === 'map' ? 'mindMaps' : 'quizzes';
    setData(prev => ({
      ...prev,
      [key]: (prev[key] as any[]).map(item => item.id === id ? updated : item)
    }));
  };

  return {
    ...data,
    login,
    register,
    logout,
    setClass,
    updateProfile,
    updateProgress,
    askSparky,
    addContent,
    removeContent,
    editContent,
    chapters: INITIAL_CHAPTERS
  };
};