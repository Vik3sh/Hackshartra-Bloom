import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LESSON_MODULES } from '@/data/lessons';

export default function SimpleLessonTest() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-blue-900 mb-2">📚 Lesson Test</h2>
        <p className="text-blue-600 text-lg">Testing lesson display</p>
      </div>

      <div className="space-y-4">
        {LESSON_MODULES.map((module) => (
          <Card key={module.id} className="bg-white border-blue-200">
            <CardHeader>
              <CardTitle className="text-xl text-blue-900">{module.title}</CardTitle>
              <p className="text-blue-600">{module.description}</p>
            </CardHeader>
            <CardContent>
              <p>Total Lessons: {module.totalLessons}</p>
              <p>Module ID: {module.id}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
