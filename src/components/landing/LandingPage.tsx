import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Leaf, Trophy, BookOpen, Sparkles } from 'lucide-react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        url?: string;
      };
    }
  }
}

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const bgRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const el = bgRef.current;
      if (!el) return;
      const x = (e.clientX / window.innerWidth) * 2 - 1; // -1..1
      const y = (e.clientY / window.innerHeight) * 2 - 1; // -1..1
      const rotateX = y * -5; // tilt up/down
      const rotateY = x * 5;  // tilt left/right
      el.style.transform = `scale(1.8) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div className="min-h-screen relative text-blue-900">
      {/* Fullscreen 3D Earth background */}
      <div ref={bgRef} className="fixed inset-0 -z-10 transform-gpu will-change-transform" style={{ transition: 'transform 120ms linear' }}>
        <spline-viewer style={{ width: '100%', height: '100%', pointerEvents: 'none' }} url="https://prod.spline.design/DipzZnc81UPmw248/scene.splinecode"></spline-viewer>
      </div>
      {/* Hero */}
      <header className="sticky top-0 z-20 bg-white/70 backdrop-blur border-b border-blue-200">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Bloom</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Link to="#features"><Button variant="ghost">Features</Button></Link>
            <Link to="#how-it-works"><Button variant="ghost">How it works</Button></Link>
            <Link to="#rewards"><Button variant="ghost">Rewards</Button></Link>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => navigate('/auth')}>
              Get started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero section */}
        <section className="mx-auto max-w-7xl px-4 pt-16 pb-12 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Gamified environmental learning that helps you grow every day
            </h1>
            <p className="mt-4 text-blue-700 text-lg">
              Learn climate science, sustainability and eco-habits through lessons, challenges and rewards.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button size="lg" onClick={() => navigate('/auth')}>Sign up free</Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
            </div>
            <p className="mt-3 text-sm text-blue-600">No card required. Sign in/up to save your progress.</p>
          </div>
          {/* Right column intentionally empty; background 3D fills whole page */}
          <div className="hidden md:block" />
        </section>

        {/* Features - revealed as you scroll up/down */}
        <section id="features" className="mx-auto max-w-7xl px-4 py-12 grid md:grid-cols-3 gap-6">
          <Card className="bg-white border-blue-200">
            <CardContent className="p-6">
              <div className="w-10 h-10 rounded bg-green-100 flex items-center justify-center mb-4">
                <BookOpen className="w-5 h-5 text-green-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Learn by doing</h3>
              <p className="text-blue-700">Short, practical lessons and quizzes make complex topics easy.</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-blue-200">
            <CardContent className="p-6">
              <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center mb-4">
                <Trophy className="w-5 h-5 text-blue-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Earn rewards</h3>
              <p className="text-blue-700">Collect points, unlock badges, and keep your streak alive.</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-blue-200">
            <CardContent className="p-6">
              <div className="w-10 h-10 rounded bg-emerald-100 flex items-center justify-center mb-4">
                <Leaf className="w-5 h-5 text-emerald-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">See your impact</h3>
              <p className="text-blue-700">Track progress on your dashboard and grow your eco-tree.</p>
            </CardContent>
          </Card>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-12">
          <h2 className="text-2xl font-bold mb-6">How it works</h2>
          <ol className="grid md:grid-cols-3 gap-6 list-decimal list-inside">
            <li className="bg-white/80 border border-blue-200 rounded-lg p-5">Create your account and set your goals</li>
            <li className="bg-white/80 border border-blue-200 rounded-lg p-5">Complete lessons and daily eco-challenges</li>
            <li className="bg-white/80 border border-blue-200 rounded-lg p-5">Earn points and view progress on the dashboard</li>
          </ol>
        </section>

        {/* Rewards callout */}
        <section id="rewards" className="mx-auto max-w-7xl px-4 pb-16">
          <Card className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
            <CardContent className="p-6 flex items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-2xl font-bold">Ready to start your eco-journey?</h3>
                <p className="text-blue-50 mt-1">Sign in or create an account to access the dashboard.</p>
              </div>
              {/* Buttons removed as requested */}
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t border-blue-200 bg-white/60">
        <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-blue-700 flex items-center justify-between">
          <span>© {new Date().getFullYear()} Bloom</span>
          <Link className="underline" to="/dashboard">Go to Dashboard</Link>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;