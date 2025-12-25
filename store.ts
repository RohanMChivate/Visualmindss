
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
      avatar: '🍎',
      progress: { watchedVideos: [], quizScores: {} }
    }
  ],
  videos: [],
  mindMaps: [],
  quizzes: [
    {
      id: 'q-tenali-1',
      chapterId: 'c3-1',
      classLevel: ClassLevel.CLASS_3,
      title: "How Tenali Rama Became a Jester 🎭",
      questions: [
        { id: 'tq1', text: 'Where did Rama live?', options: ['Vijayanagara', 'Tenali', 'Delhi', 'Mysore'], correctAnswer: 1 },
        { id: 'tq2', text: 'Who taught Rama a prayer?', options: ['A king', 'A priest', 'A wandering sage', 'A merchant'], correctAnswer: 2 },
        { id: 'tq3', text: 'To whom was Rama asked to pray?', options: ['Goddess Lakshmi', 'Goddess Saraswati', 'Goddess Kali', 'Goddess Parvati'], correctAnswer: 2 },
        { id: 'tq4', text: 'How many times did Rama have to recite the prayer?', options: ['One thousand times', 'One million times', 'Three million times', 'Five million times'], correctAnswer: 2 },
        { id: 'tq5', text: 'Why did Rama laugh when he saw Goddess Kali?', options: ['He was afraid', 'He found her funny', 'He made a clever joke about her many faces', 'He did not respect her'], correctAnswer: 2 },
        { id: 'tq6', text: 'What did the Goddess curse Rama to become?', options: ['A king', 'A poet', 'A warrior', 'A jester'], correctAnswer: 3 },
        { id: 'tq7', text: 'What word did Rama say was a palindrome?', options: ['Tenali', 'Kali', 'Vikatakavi', 'Vijayanagara'], correctAnswer: 2 },
        { id: 'tq8', text: 'In whose court did Tenali Rama become a jester?', options: ['King Ashoka', 'King Akbar', 'King Krishnadevaraya', 'King Harsha'], correctAnswer: 2 },
        { id: 'tq9', text: 'What was Rama’s nature as a boy?', options: ['Lazy and dull', 'Clever and brave', 'Angry and rude', 'Quiet and shy'], correctAnswer: 1 },
        { id: 'tq10', text: 'What lesson do we learn from the story?', options: ['We should fear the gods', 'Cleverness is more important than strength', 'We should always be serious', 'Kings should not have jesters'], correctAnswer: 1 }
      ]
    },
    {
      id: 'q-chimpu-1',
      chapterId: 'c4-1',
      classLevel: ClassLevel.CLASS_4,
      title: 'Chimpu Monkey Challenge 🐒',
      questions: [
        { id: 'q1', text: 'Who was Chimpu?', options: ['A dog', 'A monkey', 'A cat', 'A bird'], correctAnswer: 1 },
        { id: 'q2', text: 'Where did Chimpu live?', options: ['In a zoo', 'In a forest', 'In a village', 'In a city'], correctAnswer: 1 },
        { id: 'q3', text: 'What kind of monkey was Chimpu?', options: ['Lazy', 'Angry', 'Naughty', 'Sad'], correctAnswer: 2 },
        { id: 'q4', text: 'What did Chimpu like to do most?', options: ['Sleep all day', 'Help others', 'Steal food', 'Play tricks'], correctAnswer: 3 },
        { id: 'q5', text: 'Who did Chimpu often trouble?', options: ['Forest animals', 'Village people', 'Farmers', 'Children'], correctAnswer: 1 },
        { id: 'q6', text: 'What happened because of Chimpu’s naughty behaviour?', options: ['People praised him', 'People laughed', 'People got angry', 'People rewarded him'], correctAnswer: 2 },
        { id: 'q7', text: 'What lesson did Chimpu learn at the end of the story?', options: ['To be clever', 'To be brave', 'To behave well', 'To run fast'], correctAnswer: 2 },
        { id: 'q8', text: 'How did the people react when Chimpu changed his behaviour?', options: ['They chased him', 'They ignored him', 'They forgave him', 'They punished him'], correctAnswer: 2 },
        { id: 'q9', text: 'What message does the story “Chimpu Monkey” give us?', options: ['Being naughty is good', 'Tricks make us famous', 'Good behaviour is important', 'Animals should fear humans'], correctAnswer: 2 },
        { id: 'q10', text: 'Which word best describes Chimpu at the end of the story?', options: ['Naughty', 'Helpful', 'Lazy', 'Careless'], correctAnswer: 1 }
      ]
    },
    {
      id: 'q-dignity-1',
      chapterId: 'c5-1',
      classLevel: ClassLevel.CLASS_5,
      title: 'Dignity of Labour Challenge 🛠️',
      questions: [
        { id: 'dq1', text: 'Who was the father in the story?', options: ['A farmer', 'A teacher', 'A rich businessman', 'A king'], correctAnswer: 2 },
        { id: 'dq2', text: 'What kind of a boy was the businessman’s son?', options: ['Hard-working', 'Brave', 'Lazy', 'Honest'], correctAnswer: 2 },
        { id: 'dq3', text: 'Why did the father ask his son to earn money?', options: ['To make him rich', 'To punish him', 'To teach him the value of labour', 'To send him away'], correctAnswer: 2 },
        { id: 'dq4', text: 'Who gave the boy a gold coin first?', options: ['His father', 'His mother', 'His sister', 'A shopkeeper'], correctAnswer: 1 },
        { id: 'dq5', text: 'What did the father ask the son to do with the coin?', options: ['Save it', 'Spend it', 'Throw it into the well', 'Give it to the poor'], correctAnswer: 2 },
        { id: 'dq6', text: 'Why did the father send his wife and daughter away?', options: ['He was angry with them', 'He wanted to live alone', 'They helped the boy without working', 'They were going on a trip'], correctAnswer: 2 },
        { id: 'dq7', text: 'Where did the boy finally go to earn money?', options: ['To a farm', 'To a factory', 'To the market', 'To school'], correctAnswer: 2 },
        { id: 'dq8', text: 'How did the boy earn two rupees?', options: ['By selling fruits', 'By carrying a shopkeeper’s bag', 'By cleaning a shop', 'By working in a field'], correctAnswer: 1 },
        { id: 'dq9', text: 'Why did the boy refuse to throw the two-rupee coin into the well?', options: ['He was afraid', 'He loved money', 'He had earned it by hard work', 'He wanted to buy food'], correctAnswer: 2 },
        { id: 'dq10', text: 'What lesson does the story teach us?', options: ['Money is everything', 'Parents are strict', 'Hard work has dignity', 'Children should not work'], correctAnswer: 2 }
      ]
    }
  ],
  currentUser: null
};

export const useStore = () => {
  const [data, setData] = useState<AppData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (!parsed.users.some((u: User) => u.email === 'admin@visualminds.com')) {
          parsed.users.push(initialData.users[0]);
        }
        return { ...parsed, currentUser: null };
      } catch (e) {
        return initialData;
      }
    }
    return initialData;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Storage failed:", e);
    }
  }, [data]);

  const login = (email: string, role: UserRole, password?: string) => {
    const emailClean = email.trim().toLowerCase();
    
    if (role === UserRole.ADMIN) {
      if (password === 'teacher@123') {
        let existingAdmin = data.users.find(u => u.email.toLowerCase() === emailClean && u.role === UserRole.ADMIN);
        if (!existingAdmin) {
          const newAdmin: User = {
            id: Math.random().toString(36).substr(2, 9),
            name: emailClean.split('@')[0],
            email: emailClean,
            role: UserRole.ADMIN,
            avatar: '🍎',
            progress: { watchedVideos: [], quizScores: {} }
          };
          setData(prev => ({
            ...prev,
            users: [...prev.users, newAdmin],
            currentUser: newAdmin
          }));
        } else {
          setData(prev => ({ ...prev, currentUser: existingAdmin }));
        }
        return true;
      }
      return false;
    }

    if (role === UserRole.STUDENT) {
      const existingStudent = data.users.find(u => u.email.toLowerCase() === emailClean && u.role === UserRole.STUDENT);
      if (existingStudent) {
        setData(prev => ({ ...prev, currentUser: existingStudent }));
        return true;
      }
      // No automatic creation for students. They must register first.
      return false;
    }
    return false;
  };

  const register = (name: string, email: string) => {
    const emailClean = email.trim().toLowerCase();
    const exists = data.users.find(u => u.email.toLowerCase() === emailClean && u.role === UserRole.STUDENT);
    if (exists) {
      setData(prev => ({ ...prev, currentUser: exists }));
      return;
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      email: emailClean,
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

  const updateProfile = (name: string, avatar: string, selectedClass?: ClassLevel) => {
    setData(prev => {
      if (!prev.currentUser) return prev;
      const updatedUser = { 
        ...prev.currentUser, 
        name, 
        avatar,
        selectedClass: selectedClass || prev.currentUser.selectedClass
      };
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
        newProgress.watchedVideos = [...newProgress.watchedVideos, videoId];
      }
      
      if (quizResult) {
        if (newProgress.quizScores[quizResult.quizId] === undefined) {
          newProgress.quizScores = {
            ...newProgress.quizScores,
            [quizResult.quizId]: quizResult.score
          };
        }
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
    const apiKey = (process.env as any).API_KEY;
    if (!apiKey) return "Sparky is waiting for a magic key! ✨ Ask your teacher to check the setup.";
    try {
      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `You are Sparky, a friendly AI tutor for students in Classes 3-5. Topic context: ${contextChapter || 'School Lessons'}. Rules: Be encouraging, use emojis, keep answers very short (max 3 sentences). If a question is complex, simplify it like a story.`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: question,
        config: { systemInstruction, temperature: 0.8 },
      });
      return response.text || "Oops! Sparky's magic failed. Try asking again?";
    } catch (error) {
      return "Sparky is taking a tiny nap! 🪄 Try again in a moment.";
    }
  };

  const addContent = (type: 'video' | 'map' | 'quiz', content: any) => {
    const key = type === 'video' ? 'videos' : type === 'map' ? 'mindMaps' : 'quizzes';
    setData(prev => ({ ...prev, [key]: [...(prev[key] as any[]), content] }));
  };

  const removeContent = (type: 'video' | 'map' | 'quiz', id: string) => {
    const key = type === 'video' ? 'videos' : type === 'map' ? 'mindMaps' : 'quizzes';
    setData(prev => ({ ...prev, [key]: (prev[key] as any[]).filter(item => item.id !== id) }));
  };

  const editContent = (type: 'video' | 'map' | 'quiz', id: string, updated: any) => {
    const key = type === 'video' ? 'videos' : type === 'map' ? 'mindMaps' : 'quizzes';
    setData(prev => ({ ...prev, [key]: (prev[key] as any[]).map(item => item.id === id ? updated : item) }));
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
