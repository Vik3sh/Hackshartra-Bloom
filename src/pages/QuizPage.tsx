import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useProgress } from '@/contexts/ProgressContext';

type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

type Question = {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
};

type Lesson = {
  id: string;
  title: string;
  description?: string;
  difficulty: Difficulty;
  questions: Question[];
};

const ALL_LESSONS: Lesson[] = [
  {
    id: 'l1',
    title: 'Recycling Basics',
    difficulty: 'Beginner',
    description: 'Learn what can be recycled and how to sort materials.',
    questions: [
      { id: 'q1', text: 'Which bin should paper go in?', options: ['Organic', 'Recycling', 'Landfill'], correctIndex: 1 },
      { id: 'q2', text: 'Is pizza box with grease recyclable?', options: ['Yes', 'No', 'Sometimes'], correctIndex: 2 }
    ]
  },
  {
    id: 'l2',
    title: 'Water Conservation',
    difficulty: 'Beginner',
    description: 'Tips to save water at home.',
    questions: [
      { id: 'q3', text: 'Turning off the tap while brushing saves roughly?', options: ['1L', '6L', '20L'], correctIndex: 1 },
      { id: 'q4', text: 'Collecting rainwater is useful for?', options: ['Garden', 'Drinking', 'Both'], correctIndex: 0 }
    ]
  },
  {
    id: 'l3',
    title: 'Climate Change Overview',
    difficulty: 'Intermediate',
    description: 'Causes and effects of global warming.',
    questions: [
      { id: 'q5', text: 'Main greenhouse gas from fossil fuels?', options: ['CO2', 'O2', 'N2'], correctIndex: 0 }
    ]
  },
  {
    id: 'l4',
    title: 'Biodiversity & Habitats',
    difficulty: 'Intermediate',
    description: 'Why habitats and species matter.',
    questions: [
      { id: 'q6', text: 'Biodiversity means?', options: ['Many species', 'One species', 'No species'], correctIndex: 0 }
    ]
  },
  {
    id: 'l5',
    title: 'Sustainable Energy',
    difficulty: 'Advanced',
    description: 'Basics of renewable energy.',
    questions: [
      { id: 'q7', text: 'Solar energy converts?', options: ['Wind', 'Sunlight', 'Water'], correctIndex: 1 }
    ]
  }
];

const DIFFICULTIES: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced'];

const COLORS = {
  primary: '#00a2ff',
  lessonBg: '#f7faff',
  progressBg: '#e6ebf2',
  startBtn: '#ffcc33'
};

const XP_PER_LESSON: Record<Difficulty, number> = {
  Beginner: 1000,
  Intermediate: 2000,
  Advanced: 3000
};

const QuizPage: React.FC = () => {
  const { toast } = useToast();
  const { completeQuiz } = useProgress();

  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('Beginner');
  const [openModules, setOpenModules] = useState<Record<Difficulty, boolean>>({ Beginner: true, Intermediate: false, Advanced: false });
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Record<string, number>>({});
  const [xp, setXp] = useState(0);
  const [badges, setBadges] = useState<string[]>([]);

  const isLocked = (d: Difficulty) => {
    if (d === 'Beginner') return false;
    const beginnerLessonIds = ALL_LESSONS.filter(l => l.difficulty === 'Beginner').map(l => l.id);
    return !beginnerLessonIds.every(id => completedLessons[id]);
  };

  const toggleModule = (d: Difficulty) => {
    if (isLocked(d)) {
      toast({ title: 'Locked', description: 'Complete all Beginner lessons to unlock this level.', variant: 'destructive' });
      return;
    }
    setOpenModules(prev => ({ ...prev, [d]: !prev[d] }));
    setSelectedDifficulty(d);
  };

  // Daily goal timer
  const [activitySeconds, setActivitySeconds] = useState(0);
  const dailyGoalSeconds = 15 * 60; // 15 minutes
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (activeLesson) {
      if (intervalRef.current === null) {
        intervalRef.current = window.setInterval(() => {
          setActivitySeconds(s => s + 1);
        }, 1000) as unknown as number;
      }
    } else {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [activeLesson]);

  const availableLessons = useMemo(() => ALL_LESSONS.filter(l => l.difficulty === selectedDifficulty), [selectedDifficulty]);


  const startLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
  };

  const handleSelectOption = (idx: number) => {
    setSelectedOption(idx);
  };

  const finishLesson = (lesson: Lesson, finalScore: number) => {
    const pct = Math.round((finalScore / lesson.questions.length) * 100);
    setCompletedLessons(prev => ({ ...prev, [lesson.id]: pct }));

    const earned = XP_PER_LESSON[lesson.difficulty];
    setXp(prev => prev + earned);
    
    // Define tree rewards based on difficulty (Quizzes focus on basic items)
    const treeRewards = {
      Beginner: { seed: 1, water: 0, sunlight: 0 },
      Intermediate: { seed: 0, water: 1, sunlight: 1 },
      Advanced: { water: 0, sunlight: 0, nutrients: 1 }
    };

    // Complete quiz with tree rewards
    completeQuiz(lesson.id, earned, treeRewards[lesson.difficulty]);
    
    // Create detailed reward message
    const rewardItems = Object.entries(treeRewards[lesson.difficulty])
      .filter(([_, count]) => count > 0)
      .map(([item, count]) => `${count} ${item}${count > 1 ? 's' : ''}`)
      .join(', ');
    
    toast({ 
      title: `🎉 Quiz Complete! +${earned.toLocaleString()} XP`, 
      description: `Earned: ${rewardItems} - Your tree is growing!`, 
      variant: 'success' 
    });

    // badge logic: unlock when all lessons of difficulty completed
    const lessonsOfDiff = ALL_LESSONS.filter(l => l.difficulty === lesson.difficulty).map(l => l.id);
    const nowCompleted = new Set(Object.keys(completedLessons));
    nowCompleted.add(lesson.id);
    const completedAll = lessonsOfDiff.every(id => nowCompleted.has(id));
    if (completedAll && !badges.includes(lesson.difficulty)) {
      setBadges(prev => [...prev, lesson.difficulty]);
      toast({ title: `Badge unlocked: ${lesson.difficulty}`, description: `Completed all ${lesson.difficulty} lessons`, variant: 'default' });
    }
  };

  const handleNext = () => {
    if (!activeLesson) return;
    const q = activeLesson.questions[currentQuestionIndex];
    if (selectedOption === null) {
      toast({ title: 'Select an answer', variant: 'destructive' });
      return;
    }
    let newScore = score;
    if (selectedOption === q.correctIndex) {
      newScore = score + 1;
      setScore(newScore);
    }
    setSelectedOption(null);
    if (currentQuestionIndex + 1 < activeLesson.questions.length) {
      setCurrentQuestionIndex(i => i + 1);
    } else {
      finishLesson(activeLesson, newScore);
      setActiveLesson(null);
    }
  };

  const handleQuit = () => {
    setActiveLesson(null);
    setSelectedOption(null);
  };

  const progressPercent = useMemo(() => {
    const total = ALL_LESSONS.filter(l => l.difficulty === selectedDifficulty).length;
    if (total === 0) return 0;
    const done = Object.keys(completedLessons).filter(id => {
      const ls = ALL_LESSONS.find(l => l.id === id);
      return ls && ls.difficulty === selectedDifficulty;
    }).length;
    return Math.round((done / total) * 100);
  }, [completedLessons, selectedDifficulty]);

  const avgScore = useMemo(() => {
    const vals = Object.values(completedLessons);
    if (vals.length === 0) return 0;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  }, [completedLessons]);

  const accuracy = avgScore;

  const formatTime = (s: number) => {
    const mm = Math.floor(s / 60).toString().padStart(2, '0');
    const ss = (s % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  };

  const handlePrintCertificate = () => {
    const confirmText = `Certificate - ${selectedDifficulty} unit\nProgress: ${progressPercent}%\nXP: ${xp}`;
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`<pre style="font-family: Arial; padding: 40px;">${confirmText}</pre>`);
    w.document.close();
    w.print();
  };

  return (
    <div className="min-h-screen bg-[#F6F7FB] font-sans relative">
      {/* Decorative top band that extends behind the Mondly navbar (half height) */}
      {/* Decorative band starting from bottom of the navbar and extending down */}
      <div className="fixed left-0 right-0 top-16 h-10 md:top-20 md:h-12 z-40 pointer-events-none rounded-b-lg" style={{ background: '#F6F7FB' }} />
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-4 mt-6">
        <Card className="rounded-[10px] bg-white shadow p-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white shadow flex items-center justify-center overflow-hidden" />
                <div style={{ width: 360 }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-slate-800">Quiz Learner (1/5)</div>
                    <div className="text-xs text-slate-500">Lvl 1</div>
                  </div>
                  <div className="w-full rounded-[10px]" style={{ background: COLORS.progressBg, height: 12 }}>
                    <div style={{ width: `${Math.min(100, (xp / 5000) * 100)}%`, height: 12, background: COLORS.primary, borderRadius: 10 }} />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-xs text-slate-500">Avg Score</div>
                  <div className="font-semibold text-slate-800">{avgScore}%</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-slate-500">Accuracy</div>
                  <div className="font-semibold text-slate-800">{accuracy}%</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-slate-500">Daily Goal</div>
                  <div className="text-sm font-bold">{formatTime(activitySeconds)} / {formatTime(dailyGoalSeconds)}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-[10px] shadow p-4">
              <h4 className="font-semibold text-slate-700 mb-3">Learn</h4>
              <div className="space-y-3">
                {DIFFICULTIES.map(d => (
                  <div key={d}>
                    <button
                      onClick={() => toggleModule(d)}
                      className={`w-full text-left px-3 py-3 rounded-[10px] flex items-center justify-between ${(openModules[d] || selectedDifficulty === d) ? 'bg-[color:var(--primary)] text-white' : 'bg-white text-slate-700'} ${isLocked(d) ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
                      style={{ border: `1px solid ${(openModules[d] || selectedDifficulty === d) ? COLORS.primary : '#f0f2f5'}` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold`} style={{ background: (openModules[d] || selectedDifficulty === d) ? COLORS.primary : '#f3f6fb', color: (openModules[d] || selectedDifficulty === d) ? '#fff' : COLORS.primary }}>{d[0]}</div>
                        <div className="font-medium">{d}{isLocked(d) ? ' 🔒' : ''}</div>
                      </div>
                      <div className="text-sm opacity-70">▶</div>
                    </button>

                    {openModules[d] && (
                      <div className="mt-2 space-y-1 pl-4">
                        {ALL_LESSONS.filter(l => l.difficulty === d).map(ls => (
                          <div key={ls.id} className="text-sm text-slate-600 py-2 flex items-center justify-between rounded-[8px] hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedDifficulty(d)}>
                            <div>{ls.title}</div>
                            <div className="text-xs text-slate-400">{completedLessons[ls.id] ? `${completedLessons[ls.id]}%` : ''}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[10px] shadow p-4">
              <h5 className="text-sm font-medium text-slate-600">Practice</h5>
              <p className="text-xs text-slate-400 mt-2">Reinforcement and stories about environment topics.</p>
            </div>
          </aside>

          {/* Main area */}
          <section className="lg:col-span-2">
            <div className="rounded-[10px] p-6 shadow-lg" style={{ background: COLORS.primary }}>
              <div className="flex items-center justify-between mb-4 text-white">
                <div>
                  <div className="text-sm opacity-90">{progressPercent}% Complete</div>
                  <div className="text-2xl font-semibold">Getting Started</div>
                </div>
                <div>
                  <Button onClick={handlePrintCertificate} className="rounded-[10px]" style={{ background: COLORS.startBtn }}>Print Unit Certificate</Button>
                </div>
              </div>

              <div className="space-y-4 mt-6">
                {!activeLesson && (
                  ALL_LESSONS.filter(l => l.difficulty === selectedDifficulty).map((l, i) => (
                    <div key={l.id} className="flex items-center justify-between p-4 rounded-[10px] shadow" style={{ background: COLORS.lessonBg }}>
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-semibold">{i+1}</div>
                        <div>
                          <div className="font-medium text-slate-800">{l.title}</div>
                          <div className="text-xs text-slate-500 mt-1">{l.description}</div>
                          <div className="mt-3 w-64 rounded-[10px]" style={{ background: COLORS.progressBg, height: 8 }}>
                            <div style={{ width: `${completedLessons[l.id] ?? 0}%`, height: 8, background: COLORS.primary, borderRadius: 10 }} />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-xs text-slate-500 mr-2">{completedLessons[l.id] ? `${completedLessons[l.id]}%` : ''}</div>
                        <Button onClick={() => { if (isLocked(l.difficulty)) { toast({ title: 'Locked', description: 'Complete Beginner lessons to unlock this level.', variant: 'destructive' }); return; } startLesson(l); }} className="px-4 py-2 rounded-[10px]" style={{ background: COLORS.startBtn }}>
                          {isLocked(l.difficulty) ? 'Locked' : 'Start'}
                        </Button>
                      </div>
                    </div>
                  ))
                )}

                {activeLesson && (
                  <div className="bg-white rounded-[10px] p-6 text-black shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-lg font-semibold">{activeLesson.title}</div>
                        <div className="text-xs text-slate-500">Question {currentQuestionIndex + 1} of {activeLesson.questions.length}</div>
                      </div>
                      <div>
                        <Button variant="outline" onClick={handleQuit} className="rounded-[10px]">Back</Button>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="text-md font-medium mb-3">{activeLesson.questions[currentQuestionIndex].text}</div>
                      <div className="space-y-3">
                        {activeLesson.questions[currentQuestionIndex].options.map((opt, idx) => {
                          const checked = selectedOption === idx;
                          return (
                            <button key={opt} onClick={() => handleSelectOption(idx)} className={`w-full text-left px-4 py-3 rounded-[10px] border ${checked ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'}`}>
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-slate-600">Score: {score}</div>
                        <div>
                          <Button onClick={handleNext} className="bg-green-600 rounded-[10px]">{currentQuestionIndex + 1 < activeLesson.questions.length ? 'Next' : 'Finish'}</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </section>

          {/* Right column */}
          <aside className="lg:col-span-1">
            <Card className="rounded-[10px] bg-white shadow p-4">
              <h5 className="text-sm font-semibold text-slate-700">Your Progress</h5>
              <div className="mt-4">
                <div className="w-full rounded-[10px] h-3 overflow-hidden" style={{ background: COLORS.progressBg }}>
                  <div style={{ width: `${progressPercent}%`, height: 8, background: COLORS.primary, borderRadius: 10 }} />
                </div>
                <div className="text-xs text-slate-500 mt-2">Level: {selectedDifficulty}</div>
                <div className="mt-3 text-xs text-slate-600">Completed lessons:</div>
                <ul className="mt-2 text-xs text-slate-700 list-disc list-inside">
                  {Object.keys(completedLessons).length === 0 && <li>None yet</li>}
                  {Object.entries(completedLessons).map(([id, pct]) => {
                    const lesson = ALL_LESSONS.find(l => l.id === id);
                    return lesson ? <li key={id}>{lesson.title} — {pct}%</li> : null;
                  })}
                </ul>

                <div className="mt-4 text-sm font-medium">XP: {xp.toLocaleString()}</div>
                <div className="mt-2 text-xs">Badges: {badges.join(', ') || 'None'}</div>
              </div>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default QuizPage;
