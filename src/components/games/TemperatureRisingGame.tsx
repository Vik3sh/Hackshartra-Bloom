import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Thermometer, 
  TreePine, 
  Rabbit, 
  Bird, 
  Fish, 
  CheckCircle, 
  XCircle,
  RotateCcw,
  Trophy,
  Sun,
  Snowflake
} from 'lucide-react';

interface Animal {
  id: string;
  name: string;
  icon: React.ReactNode;
  preferredTemp: number;
  tolerance: number;
  currentTemp: number;
  isComfortable: boolean;
  position: { x: number; y: number };
}

interface TemperatureRisingGameProps {
  onComplete: (score: number, animalsSaved: number) => void;
  onClose: () => void;
}

const TemperatureRisingGame: React.FC<TemperatureRisingGameProps> = ({ onComplete, onClose }) => {
  const [temperature, setTemperature] = useState(20); // Starting temperature
  const [gameTime, setGameTime] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'completed' | 'gameOver'>('playing');
  const [score, setScore] = useState(0);
  const [animalsSaved, setAnimalsSaved] = useState(0);
  const [gameDuration] = useState(45); // 45 seconds for better pacing

  const [animals, setAnimals] = useState<Animal[]>([
    { id: '1', name: 'Arctic Fox', icon: <Rabbit className="w-6 h-6" />, preferredTemp: 5, tolerance: 3, currentTemp: 20, isComfortable: false, position: { x: 20, y: 20 } },
    { id: '2', name: 'Polar Bear', icon: <Rabbit className="w-6 h-6" />, preferredTemp: 0, tolerance: 5, currentTemp: 20, isComfortable: false, position: { x: 80, y: 15 } },
    { id: '3', name: 'Tropical Bird', icon: <Bird className="w-6 h-6" />, preferredTemp: 30, tolerance: 4, currentTemp: 20, isComfortable: false, position: { x: 15, y: 80 } },
    { id: '4', name: 'Coral Fish', icon: <Fish className="w-6 h-6" />, preferredTemp: 25, tolerance: 2, currentTemp: 20, isComfortable: false, position: { x: 85, y: 85 } },
    { id: '5', name: 'Forest Deer', icon: <Rabbit className="w-6 h-6" />, preferredTemp: 15, tolerance: 6, currentTemp: 20, isComfortable: false, position: { x: 50, y: 50 } }
  ]);

  // Game timer
  useEffect(() => {
    if (gameState === 'playing' && gameTime < gameDuration) {
      const timer = setTimeout(() => setGameTime(gameTime + 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameTime >= gameDuration) {
      setGameState('completed');
    }
  }, [gameTime, gameState, gameDuration]);

  // Update animal comfort based on temperature
  useEffect(() => {
    setAnimals(prevAnimals => 
      prevAnimals.map(animal => {
        const tempDiff = Math.abs(temperature - animal.preferredTemp);
        const isComfortable = tempDiff <= animal.tolerance;
        return { ...animal, currentTemp: temperature, isComfortable };
      })
    );
  }, [temperature]);

  // Calculate score based on comfortable animals
  useEffect(() => {
    const comfortableCount = animals.filter(animal => animal.isComfortable).length;
    setAnimalsSaved(comfortableCount);
    setScore(comfortableCount * 20 + (gameDuration - gameTime) * 2);
  }, [animals, gameTime, gameDuration]);

  const handleTemperatureChange = (value: number[]) => {
    setTemperature(value[0]);
  };

  const resetGame = () => {
    setTemperature(20);
    setGameTime(0);
    setGameState('playing');
    setScore(0);
    setAnimalsSaved(0);
  };

  const getTemperatureColor = (temp: number) => {
    if (temp < 10) return 'text-blue-500';
    if (temp < 20) return 'text-green-500';
    if (temp < 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getTemperatureIcon = (temp: number) => {
    if (temp < 10) return <Snowflake className="w-4 h-4" />;
    if (temp < 30) return <Sun className="w-4 h-4" />;
    return <Thermometer className="w-4 h-4" />;
  };

  if (gameState === 'completed' || gameState === 'gameOver') {
    return createPortal(
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 99999 }}>
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Trophy className="w-16 h-16 text-yellow-500" />
            </div>
            <CardTitle className="text-2xl">Game Completed!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-green-600">{score}</div>
              <div className="text-sm text-gray-600">Final Score</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold">{animalsSaved}/5</div>
                <div className="text-gray-600">Animals Saved</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{Math.floor(gameTime / 60)}:{(gameTime % 60).toString().padStart(2, '0')}</div>
                <div className="text-gray-600">Time Used</div>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button onClick={resetGame} className="flex-1">
                <RotateCcw className="w-4 h-4 mr-2" />
                Play Again
              </Button>
              <Button onClick={() => onComplete(score, animalsSaved)} className="flex-1">
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
      <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Temperature Rising - Forest Habitat</CardTitle>
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm">
              <div className="font-semibold">Score: {score}</div>
              <div className="text-gray-600">Animals Saved: {animalsSaved}/5</div>
            </div>
            <div className="text-sm">
              <div className="font-semibold">Time: {Math.floor((gameDuration - gameTime) / 60)}:{((gameDuration - gameTime) % 60).toString().padStart(2, '0')}</div>
              <Progress value={(gameTime / gameDuration) * 100} className="w-20 h-2 mt-1" />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Temperature Control */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {getTemperatureIcon(temperature)}
                <span className="font-semibold">Global Temperature:</span>
                <span className={`text-2xl font-bold ${getTemperatureColor(temperature)}`}>
                  {temperature}°C
                </span>
              </div>
              <Badge variant={temperature > 25 ? "destructive" : temperature < 15 ? "secondary" : "default"}>
                {temperature > 25 ? "Too Hot!" : temperature < 15 ? "Too Cold!" : "Comfortable"}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>0°C</span>
                <span>50°C</span>
              </div>
              <Slider
                value={[temperature]}
                onValueChange={handleTemperatureChange}
                max={50}
                min={0}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          {/* Forest Habitat */}
          <div className="relative bg-green-100 h-64 rounded-lg border-2 border-green-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-green-200 to-green-400"></div>
            
            {/* Animals */}
            {animals.map((animal) => (
              <div
                key={animal.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
                  animal.isComfortable ? 'scale-110' : 'scale-90'
                }`}
                style={{
                  left: `${animal.position.x}%`,
                  top: `${animal.position.y}%`,
                }}
              >
                <div className={`p-2 rounded-full border-2 ${
                  animal.isComfortable 
                    ? 'bg-green-200 border-green-500 text-green-700' 
                    : 'bg-red-200 border-red-500 text-red-700'
                }`}>
                  {animal.icon}
                </div>
                <div className="text-xs text-center mt-1 font-semibold">
                  {animal.name}
                </div>
                <div className="text-xs text-center">
                  {animal.isComfortable ? (
                    <CheckCircle className="w-3 h-3 text-green-600 mx-auto" />
                  ) : (
                    <XCircle className="w-3 h-3 text-red-600 mx-auto" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Animal Status */}
          <div className="grid grid-cols-5 gap-2">
            {animals.map((animal) => (
              <div
                key={animal.id}
                className={`p-2 rounded-lg text-center text-xs ${
                  animal.isComfortable 
                    ? 'bg-green-100 border border-green-300' 
                    : 'bg-red-100 border border-red-300'
                }`}
              >
                <div className="text-lg mb-1">{animal.icon}</div>
                <div className="font-semibold">{animal.name}</div>
                <div className="text-gray-600">Prefers: {animal.preferredTemp}°C</div>
                <div className="text-gray-600">±{animal.tolerance}°C</div>
              </div>
            ))}
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">How to Play:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Adjust the temperature slider to help animals find comfortable habitats</li>
              <li>• Each animal has a preferred temperature and tolerance range</li>
              <li>• Keep animals comfortable to earn points</li>
              <li>• Save as many animals as possible in 45 seconds!</li>
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
    </div>
  );
};

export default TemperatureRisingGame;
