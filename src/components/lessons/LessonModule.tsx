import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Lock, 
  CheckCircle, 
  Play, 
  Clock, 
  Star, 
  BookOpen,
  Video,
  FileText,
  Zap,
  HelpCircle
} from 'lucide-react';
import { LessonModule as LessonModuleType, Lesson, canAccessLesson, updateModuleProgress } from '@/data/lessons';
import { useProgress } from '@/contexts/ProgressContext';

interface LessonModuleProps {
  module: LessonModuleType;
  onStartLesson: (lesson: Lesson) => void;
}

const getLessonTypeIcon = (type: string) => {
  switch (type) {
    case 'video': return <Video className="w-4 h-4" />;
    case 'reading': return <FileText className="w-4 h-4" />;
    case 'interactive': return <Zap className="w-4 h-4" />;
    case 'quiz': return <HelpCircle className="w-4 h-4" />;
    default: return <BookOpen className="w-4 h-4" />;
  }
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner': return 'bg-green-100 text-green-800';
    case 'intermediate': return 'bg-yellow-100 text-yellow-800';
    case 'advanced': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function LessonModule({ module, onStartLesson }: LessonModuleProps) {
  const { userProgress } = useProgress();
  const [expanded, setExpanded] = useState(false);
  
  // Update module progress based on completed lessons
  const updatedModule = updateModuleProgress(module.id, userProgress.completedLessons);

  const handleStartLesson = (lesson: Lesson) => {
    if (canAccessLesson(lesson.id, userProgress.completedLessons)) {
      onStartLesson(lesson);
    }
  };

  return (
    <Card className="bg-white border-blue-200 hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
              module.color === 'red' ? 'bg-red-100' :
              module.color === 'green' ? 'bg-green-100' :
              module.color === 'yellow' ? 'bg-yellow-100' :
              module.color === 'blue' ? 'bg-blue-100' :
              'bg-gray-100'
            }`}>
              {module.icon}
            </div>
            <div>
              <CardTitle className="text-xl text-blue-900">{module.title}</CardTitle>
              <p className="text-blue-600 text-sm">{module.description}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Hide Lessons' : 'Show Lessons'}
          </Button>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-blue-700">Progress</span>
            <span className="text-sm text-blue-600">
              {updatedModule?.completedLessons || 0}/{updatedModule?.totalLessons || 0} lessons
            </span>
          </div>
          <Progress 
            value={updatedModule?.progress || 0} 
            className="h-3"
          />
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0">
          <div className="space-y-3">
            {module.lessons.map((lesson, index) => {
              const isCompleted = userProgress.completedLessons.includes(lesson.id);
              const canAccess = canAccessLesson(lesson.id, userProgress.completedLessons);
              const isLocked = !canAccess && !isCompleted;

              return (
                <div
                  key={lesson.id}
                  className={`p-4 rounded-lg border transition-all ${
                    isCompleted 
                      ? 'bg-green-50 border-green-200' 
                      : isLocked 
                        ? 'bg-gray-50 border-gray-200 opacity-60' 
                        : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted 
                          ? 'bg-green-500 text-white' 
                          : isLocked 
                            ? 'bg-gray-300 text-gray-500' 
                            : 'bg-blue-500 text-white'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : isLocked ? (
                          <Lock className="w-4 h-4" />
                        ) : (
                          <span className="text-sm font-bold">{index + 1}</span>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className={`font-semibold ${
                            isCompleted ? 'text-green-800' : 
                            isLocked ? 'text-gray-500' : 'text-blue-900'
                          }`}>
                            {lesson.title}
                          </h4>
                          {getLessonTypeIcon(lesson.type)}
                        </div>
                        <p className={`text-sm ${
                          isCompleted ? 'text-green-600' : 
                          isLocked ? 'text-gray-400' : 'text-blue-600'
                        }`}>
                          {lesson.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge className={getDifficultyColor(lesson.difficulty)}>
                            {lesson.difficulty}
                          </Badge>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            {lesson.duration}min
                          </div>
                        </div>
                        <div className="flex items-center text-xs text-blue-600">
                          <Star className="w-3 h-3 mr-1" />
                          {lesson.points} pts
                        </div>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => handleStartLesson(lesson)}
                        disabled={isLocked || isCompleted}
                        className={
                          isCompleted 
                            ? 'bg-green-100 text-green-800 cursor-not-allowed' 
                            : isLocked 
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                              : 'bg-blue-600 hover:bg-blue-700'
                        }
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Completed
                          </>
                        ) : isLocked ? (
                          <>
                            <Lock className="w-4 h-4 mr-1" />
                            Locked
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-1" />
                            Start
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {isLocked && lesson.prerequisites.length > 0 && (
                    <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-xs text-yellow-800">
                        <strong>Prerequisites:</strong> Complete previous lessons to unlock this lesson.
                      </p>
                    </div>
                  )}

                  {isCompleted && (
                    <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded">
                      <p className="text-xs text-green-800">
                        <strong>Completed!</strong> Great job on finishing this lesson.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
