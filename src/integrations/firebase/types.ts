// Firebase Firestore types for the Environmental Education Platform

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'student' | 'teacher' | 'admin';
  schoolId?: string;
  grade?: string;
  subjects?: string[];
  createdAt: Date;
  lastLoginAt: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  environmentalInterests: string[];
  learningLevel: 'beginner' | 'intermediate' | 'advanced';
  notifications: boolean;
  darkMode: boolean;
  language: string;
}

export interface School {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  principalId: string;
  teachers: string[];
  students: string[];
  createdAt: Date;
  isActive: boolean;
}

export interface EnvironmentalTopic {
  id: string;
  title: string;
  description: string;
  category: 'Climate Change & Global Warming' | 'Waste Management & Recycling' | 'Water Conservation & Sanitation' | 'Air Pollution & Energy Conservation' | 'Biodiversity & Ecosystems' | 'Sustainable Agriculture & Food Systems' | 'Renewable Energy Sources';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // in minutes
  learningObjectives: string[];
  prerequisites: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Quiz {
  id: string;
  topicId: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  timeLimit: number; // in minutes
  passingScore: number; // percentage
  attempts: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'fill-in-blank';
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  points: number;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  answers: Record<string, string | string[]>;
  score: number;
  timeSpent: number; // in minutes
  completedAt: Date;
  passed: boolean;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  type: 'simulation' | 'puzzle' | 'strategy' | 'quiz' | 'adventure';
  topicId: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // in minutes
  maxPlayers: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GameSession {
  id: string;
  gameId: string;
  players: string[]; // user IDs
  currentPlayer: string;
  gameState: Record<string, any>;
  score: Record<string, number>;
  startedAt: Date;
  completedAt?: Date;
  isActive: boolean;
}

export interface EcoChallenge {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  requirements: string[];
  rewards: ChallengeReward[];
  isActive: boolean;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
}

export interface ChallengeReward {
  type: 'badge' | 'points' | 'certificate';
  value: string | number;
  description: string;
}

export interface UserChallenge {
  id: string;
  userId: string;
  challengeId: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'failed';
  progress: number; // percentage
  startedAt?: Date;
  completedAt?: Date;
  rewards: ChallengeReward[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirements: string[];
  points: number;
  isActive: boolean;
  createdAt: Date;
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  earnedAt: Date;
  isDisplayed: boolean;
}

export interface Leaderboard {
  id: string;
  name: string;
  type: 'global' | 'school' | 'class' | 'topic';
  scope: string; // schoolId, classId, or topicId
  entries: LeaderboardEntry[];
  period: 'daily' | 'weekly' | 'monthly' | 'all-time';
  updatedAt: Date;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  score: number;
  rank: number;
  badgeCount: number;
  completedChallenges: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'achievement' | 'challenge' | 'quiz' | 'game' | 'system';
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
}

export interface Progress {
  id: string;
  userId: string;
  topicId: string;
  completedQuizzes: number;
  totalQuizzes: number;
  completedGames: number;
  totalGames: number;
  completedChallenges: number;
  totalChallenges: number;
  totalPoints: number;
  level: number;
  lastActivityAt: Date;
  updatedAt: Date;
}
