
export enum UserRole {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN'
}

export enum ClassLevel {
  CLASS_3 = '3',
  CLASS_4 = '4',
  CLASS_5 = '5'
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface Quiz {
  id: string;
  chapterId: string;
  classLevel: ClassLevel;
  title: string;
  questions: Question[];
}

export interface VideoContent {
  id: string;
  chapterId: string;
  classLevel: ClassLevel;
  title: string;
  url: string;
  thumbnail?: string;
}

export interface MindMap {
  id: string;
  chapterId: string;
  classLevel: ClassLevel;
  title: string;
  url: string;
  type: 'image' | 'pdf';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  selectedClass?: ClassLevel;
  avatar?: string;
  progress: {
    watchedVideos: string[]; // array of video IDs
    quizScores: { [quizId: string]: number };
  };
}

export interface Chapter {
  id: string;
  name: string;
  classLevel: ClassLevel;
}
