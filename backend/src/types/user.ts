// User types for the backend
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

export interface AuthResponse {
  success: boolean;
  firebaseToken?: string;
  user?: {
    id: string;
    email: string;
    role: string;
  };
  error?: string;
  message?: string;
}
