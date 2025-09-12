# 🌱 Environmental Education Platform

A gamified environmental education platform for schools and colleges, built with React, TypeScript, Supabase, and Firebase.

## 🎯 Project Overview

This platform uses gamification (quizzes, simulations, badges, leaderboards) to teach students about environmental issues like climate change, waste management, renewable energy, and conservation.

### Key Features
- **Interactive Learning Games** - Environmental quizzes and simulations
- **Eco-Challenges & Missions** - Gamified learning experiences
- **Badge System** - Achievement tracking and rewards
- **Leaderboards** - Friendly competition among students
- **Curriculum Integration** - Aligned with educational standards
- **Localized Content** - Regional environmental issues focus
- **Multi-role Support** - Students, Teachers, and Administrators

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Authentication**: Supabase Auth → Backend JWT Verification → Firebase Custom Token
- **Data Storage**: Firebase Firestore with security rules
- **UI Framework**: React + shadcn/ui components
- **State Management**: React Context + React Query

### Backend (Node.js + Express)
- **JWT Verification**: Supabase JWT → Firebase Custom Token
- **Firebase Admin SDK**: User management and data operations
- **API Routes**: Authentication and data endpoints

### Database
- **Supabase**: User authentication and profiles
- **Firebase Firestore**: Application data and user progress

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Firebase account

### 1. Clone the Repository
```bash
git clone <repository-url>
cd environmental-education-platform
```

### 2. Install Dependencies

#### Frontend
```bash
npm install
```

#### Backend
```bash
cd backend
npm install
```

### 3. Environment Setup

#### Frontend (.env.local)
```bash
cp env.example .env.local
```

Fill in your Supabase and Firebase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
# ... other Firebase config
VITE_API_URL=http://localhost:3001/api
```

#### Backend (.env)
```bash
cd backend
cp env.example .env
```

Fill in your backend credentials:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
```

### 4. Database Setup

#### Supabase Setup
1. Create a new Supabase project
2. Enable authentication
3. Set up user profiles table
4. Configure RLS policies

#### Firebase Setup
1. Create a new Firebase project
2. Enable Authentication and Firestore
3. Generate service account key
4. Set up Firestore security rules

### 5. Run the Application

#### Start Backend
```bash
cd backend
npm run dev
```

#### Start Frontend
```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 🔐 Authentication Flow

1. **User signs in with Supabase** (email/password)
2. **Supabase issues JWT token**
3. **Frontend sends JWT to backend** (`/api/auth/firebase-token`)
4. **Backend verifies Supabase JWT** using JWKS
5. **Backend creates Firebase custom token** using Admin SDK
6. **Frontend exchanges custom token** for Firebase session
7. **User can now access Firestore** with Firebase security rules

## 📁 Project Structure

```
environmental-education-platform/
├── src/                          # Frontend source code
│   ├── components/               # React components
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── auth/                # Authentication components
│   │   ├── dashboard/           # Dashboard components
│   │   └── sections/            # Page sections
│   ├── contexts/                # React contexts
│   ├── hooks/                   # Custom hooks
│   ├── integrations/            # External service integrations
│   │   ├── supabase/           # Supabase client
│   │   └── firebase/           # Firebase client
│   ├── pages/                   # Page components
│   └── services/                # API services
├── backend/                     # Backend API
│   ├── src/
│   │   ├── config/             # Configuration files
│   │   ├── routes/             # API routes
│   │   ├── middleware/         # Express middleware
│   │   └── types/              # TypeScript types
│   └── package.json
├── public/                      # Static assets
└── README.md
```

## 🎮 Environmental Learning Topics

- Climate Change & Global Warming
- Waste Management & Recycling
- Water Conservation & Sanitation
- Air Pollution & Energy Conservation
- Biodiversity & Ecosystems
- Sustainable Agriculture & Food Systems
- Renewable Energy Sources

## 🛠️ Development

### Available Scripts

#### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

#### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript
- `npm start` - Start production server
- `npm test` - Run tests

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Conventional commits

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables

### Backend (Railway/Heroku)
1. Build the project: `npm run build`
2. Deploy with environment variables
3. Ensure Firebase Admin SDK credentials are set

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Government of Punjab for the problem statement
- Supabase for authentication
- Firebase for data storage
- shadcn/ui for UI components
- React community for excellent tooling

## 📞 Support

For support, email support@environmental-education.com or create an issue in the repository.

---

**Built with ❤️ for Environmental Education**