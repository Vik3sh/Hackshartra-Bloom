import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Trash2, 
  Recycle, 
  Leaf, 
  Battery, 
  Droplets, 
  CheckCircle, 
  XCircle,
  RotateCcw,
  Trophy
} from 'lucide-react';

interface WasteItem {
  id: string;
  name: string;
  category: 'recyclable' | 'organic' | 'hazardous' | 'general';
  icon: React.ReactNode;
  description: string;
}

interface WasteSortingGameProps {
  onComplete: (score: number, timeBonus: number) => void;
  onClose: () => void;
}

const wasteItems: WasteItem[] = [
  { id: '1', name: 'Plastic Bottle', category: 'recyclable', icon: <Droplets className="w-6 h-6" />, description: 'Clean plastic bottles' },
  { id: '2', name: 'Apple Core', category: 'organic', icon: <Leaf className="w-6 h-6" />, description: 'Food waste' },
  { id: '3', name: 'Battery', category: 'hazardous', icon: <Battery className="w-6 h-6" />, description: 'Electronic waste' },
  { id: '4', name: 'Newspaper', category: 'recyclable', icon: <Recycle className="w-6 h-6" />, description: 'Paper products' },
  { id: '5', name: 'Banana Peel', category: 'organic', icon: <Leaf className="w-6 h-6" />, description: 'Food waste' },
  { id: '6', name: 'Glass Jar', category: 'recyclable', icon: <Droplets className="w-6 h-6" />, description: 'Glass containers' },
  { id: '7', name: 'Cigarette Butt', category: 'hazardous', icon: <XCircle className="w-6 h-6" />, description: 'Toxic waste' },
  { id: '8', name: 'Pizza Box', category: 'organic', icon: <Leaf className="w-6 h-6" />, description: 'Food contaminated cardboard' },
  { id: '9', name: 'Aluminum Can', category: 'recyclable', icon: <Recycle className="w-6 h-6" />, description: 'Metal containers' },
  { id: '10', name: 'Medicine', category: 'hazardous', icon: <Battery className="w-6 h-6" />, description: 'Pharmaceutical waste' },
  { id: '11', name: 'Coffee Grounds', category: 'organic', icon: <Leaf className="w-6 h-6" />, description: 'Food waste' },
  { id: '12', name: 'Cardboard Box', category: 'recyclable', icon: <Recycle className="w-6 h-6" />, description: 'Clean cardboard' },
  { id: '13', name: 'Paint Can', category: 'hazardous', icon: <XCircle className="w-6 h-6" />, description: 'Chemical waste' },
  { id: '14', name: 'Orange Peel', category: 'organic', icon: <Leaf className="w-6 h-6" />, description: 'Food waste' },
  { id: '15', name: 'Plastic Bag', category: 'recyclable', icon: <Droplets className="w-6 h-6" />, description: 'Clean plastic bags' },
  { id: '16', name: 'Light Bulb', category: 'hazardous', icon: <Battery className="w-6 h-6" />, description: 'Electronic waste' },
  { id: '17', name: 'Bread', category: 'organic', icon: <Leaf className="w-6 h-6" />, description: 'Food waste' },
  { id: '18', name: 'Tin Can', category: 'recyclable', icon: <Recycle className="w-6 h-6" />, description: 'Metal containers' },
  { id: '19', name: 'Motor Oil', category: 'hazardous', icon: <XCircle className="w-6 h-6" />, description: 'Chemical waste' },
  { id: '20', name: 'Tea Bags', category: 'organic', icon: <Leaf className="w-6 h-6" />, description: 'Food waste' }
];

const binCategories = [
  { id: 'recyclable', name: 'Recyclable', color: 'bg-blue-500', icon: <Recycle className="w-6 h-6" /> },
  { id: 'organic', name: 'Organic', color: 'bg-green-500', icon: <Leaf className="w-6 h-6" /> },
  { id: 'hazardous', name: 'Hazardous', color: 'bg-red-500', icon: <XCircle className="w-6 h-6" /> },
  { id: 'general', name: 'General', color: 'bg-gray-500', icon: <Trash2 className="w-6 h-6" /> }
];

const WasteSortingGame: React.FC<WasteSortingGameProps> = ({ onComplete, onClose }) => {
  const [currentItems, setCurrentItems] = useState<WasteItem[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // 1 minute for better pacing
  const [gameState, setGameState] = useState<'playing' | 'completed' | 'gameOver'>('playing');
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  // Initialize game
  useEffect(() => {
    const shuffled = [...wasteItems].sort(() => Math.random() - 0.5);
    setCurrentItems(shuffled.slice(0, 15)); // 15 items to sort for better pacing
  }, []);

  // Timer
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameState('gameOver');
    }
  }, [timeLeft, gameState]);

  const handleItemSort = (itemId: string, selectedCategory: string) => {
    const item = currentItems.find(i => i.id === itemId);
    if (!item) return;

    const isCorrect = item.category === selectedCategory;
    
    if (isCorrect) {
      setScore(prev => prev + 10);
      setStreak(prev => {
        const newStreak = prev + 1;
        setMaxStreak(prevMax => Math.max(prevMax, newStreak));
        return newStreak;
      });
    } else {
      setStreak(0);
    }

    // Move to next item
    if (currentItemIndex < currentItems.length - 1) {
      setCurrentItemIndex(prev => prev + 1);
    } else {
      setGameState('completed');
    }
  };

  const resetGame = () => {
    const shuffled = [...wasteItems].sort(() => Math.random() - 0.5);
    setCurrentItems(shuffled.slice(0, 15));
    setScore(0);
    setTimeLeft(60);
    setGameState('playing');
    setCurrentItemIndex(0);
    setStreak(0);
    setMaxStreak(0);
  };

  const getTimeBonus = () => {
    return Math.floor(timeLeft / 10) * 5; // 5 points per 10 seconds remaining
  };

  const getFinalScore = () => {
    return score + getTimeBonus() + (maxStreak * 5);
  };

  const currentItem = currentItems[currentItemIndex];

  if (gameState === 'completed' || gameState === 'gameOver') {
    return createPortal(
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 99999 }}>
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {gameState === 'completed' ? (
                <Trophy className="w-16 h-16 text-yellow-500" />
              ) : (
                <XCircle className="w-16 h-16 text-red-500" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {gameState === 'completed' ? 'Game Completed!' : 'Time\'s Up!'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-green-600">{getFinalScore()}</div>
              <div className="text-sm text-gray-600">Final Score</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold">{score}</div>
                <div className="text-gray-600">Base Score</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{getTimeBonus()}</div>
                <div className="text-gray-600">Time Bonus</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{maxStreak}</div>
                <div className="text-gray-600">Max Streak</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{currentItemIndex + 1}</div>
                <div className="text-gray-600">Items Sorted</div>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button onClick={resetGame} className="flex-1">
                <RotateCcw className="w-4 h-4 mr-2" />
                Play Again
              </Button>
              <Button onClick={() => onComplete(getFinalScore(), getTimeBonus())} className="flex-1">
                Complete Game
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 99999 }}>
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Waste Sorting Master</CardTitle>
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm">
              <div className="font-semibold">Score: {score}</div>
              <div className="text-gray-600">Streak: {streak}</div>
            </div>
            <div className="text-sm">
              <div className="font-semibold">Time: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
              <Progress value={(timeLeft / 60) * 100} className="w-20 h-2 mt-1" />
            </div>
            <div className="text-sm">
              <div className="font-semibold">Progress: {currentItemIndex + 1}/15</div>
              <Progress value={((currentItemIndex + 1) / 15) * 100} className="w-20 h-2 mt-1" />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Current Item */}
          {currentItem && (
            <div className="text-center space-y-4">
              <div className="text-lg font-semibold">Sort this item:</div>
              <div className="flex justify-center">
                <div className="bg-gray-100 p-6 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-4xl mb-2">{currentItem.icon}</div>
                  <div className="font-semibold text-lg">{currentItem.name}</div>
                  <div className="text-sm text-gray-600">{currentItem.description}</div>
                </div>
              </div>
            </div>
          )}

          {/* Sorting Bins */}
          <div className="grid grid-cols-2 gap-4">
            {binCategories.map((bin) => (
              <Button
                key={bin.id}
                onClick={() => currentItem && handleItemSort(currentItem.id, bin.id)}
                className={`h-20 flex flex-col items-center justify-center space-y-2 ${bin.color} hover:opacity-80 text-white`}
              >
                <div className="text-2xl">{bin.icon}</div>
                <div className="font-semibold">{bin.name}</div>
              </Button>
            ))}
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">How to Play:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Drag items to the correct recycling bin</li>
              <li>• Get 10 points for each correct sort</li>
              <li>• Build streaks for bonus points</li>
              <li>• Complete all 15 items before time runs out!</li>
            </ul>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={onClose}>
              Exit Game
            </Button>
            <Button onClick={resetGame} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Restart
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>,
    document.body
  );
};

export default WasteSortingGame;
