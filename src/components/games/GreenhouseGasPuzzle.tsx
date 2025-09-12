import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Cloud, 
  Sun, 
  TreePine, 
  Factory, 
  Car, 
  CheckCircle, 
  XCircle,
  RotateCcw,
  Trophy,
  Lightbulb,
  Zap
} from 'lucide-react';

interface PuzzlePiece {
  id: string;
  type: 'source' | 'gas' | 'effect' | 'solution';
  name: string;
  icon: React.ReactNode;
  description: string;
  correctConnections: string[];
  position: { x: number; y: number };
}

interface Connection {
  from: string;
  to: string;
  isCorrect: boolean;
}

interface GreenhouseGasPuzzleProps {
  onComplete: (score: number, connectionsCorrect: number) => void;
  onClose: () => void;
}

const GreenhouseGasPuzzle: React.FC<GreenhouseGasPuzzleProps> = ({ onComplete, onClose }) => {
  const [pieces, setPieces] = useState<PuzzlePiece[]>([
    // Sources
    { id: 'factory', type: 'source', name: 'Factory', icon: <Factory className="w-6 h-6" />, description: 'Industrial emissions', correctConnections: ['co2'], position: { x: 10, y: 20 } },
    { id: 'car', type: 'source', name: 'Cars', icon: <Car className="w-6 h-6" />, description: 'Vehicle emissions', correctConnections: ['co2', 'methane'], position: { x: 10, y: 50 } },
    { id: 'cow', type: 'source', name: 'Cattle', icon: <TreePine className="w-6 h-6" />, description: 'Livestock methane', correctConnections: ['methane'], position: { x: 10, y: 80 } },
    
    // Gases
    { id: 'co2', type: 'gas', name: 'CO₂', icon: <Cloud className="w-6 h-6" />, description: 'Carbon dioxide', correctConnections: ['warming'], position: { x: 35, y: 35 } },
    { id: 'methane', type: 'gas', name: 'CH₄', icon: <Cloud className="w-6 h-6" />, description: 'Methane', correctConnections: ['warming'], position: { x: 35, y: 65 } },
    { id: 'nitrous', type: 'gas', name: 'N₂O', icon: <Cloud className="w-6 h-6" />, description: 'Nitrous oxide', correctConnections: ['warming'], position: { x: 35, y: 50 } },
    
    // Effects
    { id: 'warming', type: 'effect', name: 'Global Warming', icon: <Sun className="w-6 h-6" />, description: 'Temperature rise', correctConnections: ['renewable', 'trees'], position: { x: 60, y: 50 } },
    
    // Solutions
    { id: 'renewable', type: 'solution', name: 'Renewable Energy', icon: <Zap className="w-6 h-6" />, description: 'Solar, wind, hydro', correctConnections: [], position: { x: 85, y: 30 } },
    { id: 'trees', type: 'solution', name: 'Plant Trees', icon: <TreePine className="w-6 h-6" />, description: 'Carbon absorption', correctConnections: [], position: { x: 85, y: 70 } }
  ]);

  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'completed' | 'gameOver'>('playing');
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes for better pacing
  const [connectionsCorrect, setConnectionsCorrect] = useState(0);

  // Timer
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameState('gameOver');
    }
  }, [timeLeft, gameState]);

  // Check if puzzle is complete
  useEffect(() => {
    const totalCorrectConnections = pieces.reduce((total, piece) => total + piece.correctConnections.length, 0);
    const currentCorrectConnections = connections.filter(conn => conn.isCorrect).length;
    setConnectionsCorrect(currentCorrectConnections);
    
    if (currentCorrectConnections === totalCorrectConnections && totalCorrectConnections > 0) {
      setGameState('completed');
    }
  }, [connections, pieces]);

  const handlePieceClick = (pieceId: string) => {
    if (selectedPiece === null) {
      setSelectedPiece(pieceId);
    } else if (selectedPiece === pieceId) {
      setSelectedPiece(null);
    } else {
      // Try to make a connection
      const fromPiece = pieces.find(p => p.id === selectedPiece);
      const toPiece = pieces.find(p => p.id === pieceId);
      
      if (fromPiece && toPiece) {
        const isCorrect = fromPiece.correctConnections.includes(pieceId) || toPiece.correctConnections.includes(selectedPiece);
        
        // Check if connection already exists
        const existingConnection = connections.find(conn => 
          (conn.from === selectedPiece && conn.to === pieceId) ||
          (conn.from === pieceId && conn.to === selectedPiece)
        );
        
        if (!existingConnection) {
          const newConnection: Connection = {
            from: selectedPiece,
            to: pieceId,
            isCorrect
          };
          
          setConnections(prev => [...prev, newConnection]);
          
          if (isCorrect) {
            setScore(prev => prev + 20);
          } else {
            setScore(prev => Math.max(0, prev - 5));
          }
        }
      }
      
      setSelectedPiece(null);
    }
  };

  const resetGame = () => {
    setConnections([]);
    setSelectedPiece(null);
    setScore(0);
    setGameState('playing');
    setTimeLeft(120);
    setConnectionsCorrect(0);
  };

  const getPieceColor = (piece: PuzzlePiece) => {
    if (selectedPiece === piece.id) return 'bg-yellow-200 border-yellow-500';
    
    switch (piece.type) {
      case 'source': return 'bg-red-100 border-red-300';
      case 'gas': return 'bg-blue-100 border-blue-300';
      case 'effect': return 'bg-orange-100 border-orange-300';
      case 'solution': return 'bg-green-100 border-green-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const getConnectionColor = (connection: Connection) => {
    return connection.isCorrect ? 'stroke-green-500' : 'stroke-red-500';
  };

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
              {gameState === 'completed' ? 'Puzzle Solved!' : 'Time\'s Up!'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-green-600">{score}</div>
              <div className="text-sm text-gray-600">Final Score</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold">{connectionsCorrect}</div>
                <div className="text-gray-600">Correct Connections</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
                <div className="text-gray-600">Time Left</div>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button onClick={resetGame} className="flex-1">
                <RotateCcw className="w-4 h-4 mr-2" />
                Play Again
              </Button>
              <Button onClick={() => onComplete(score, connectionsCorrect)} className="flex-1">
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
          <CardTitle className="text-2xl">Greenhouse Gas Puzzle</CardTitle>
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm">
              <div className="font-semibold">Score: {score}</div>
              <div className="text-gray-600">Connections: {connectionsCorrect}</div>
            </div>
            <div className="text-sm">
              <div className="font-semibold">Time: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
              <Progress value={(timeLeft / 120) * 100} className="w-20 h-2 mt-1" />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Puzzle Board */}
          <div className="relative bg-gray-50 h-96 rounded-lg border-2 border-gray-300 overflow-hidden">
            {/* Connections */}
            <svg className="absolute inset-0 w-full h-full">
              {connections.map((connection, index) => {
                const fromPiece = pieces.find(p => p.id === connection.from);
                const toPiece = pieces.find(p => p.id === connection.to);
                
                if (!fromPiece || !toPiece) return null;
                
                const fromX = (fromPiece.position.x / 100) * 100;
                const fromY = (fromPiece.position.y / 100) * 100;
                const toX = (toPiece.position.x / 100) * 100;
                const toY = (toPiece.position.y / 100) * 100;
                
                return (
                  <line
                    key={index}
                    x1={`${fromX}%`}
                    y1={`${fromY}%`}
                    x2={`${toX}%`}
                    y2={`${toY}%`}
                    stroke={connection.isCorrect ? '#10b981' : '#ef4444'}
                    strokeWidth="3"
                    className={getConnectionColor(connection)}
                  />
                );
              })}
            </svg>
            
            {/* Puzzle Pieces */}
            {pieces.map((piece) => (
              <div
                key={piece.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 hover:scale-110 ${
                  getPieceColor(piece)
                } border-2 rounded-lg p-3 text-center min-w-[80px]`}
                style={{
                  left: `${piece.position.x}%`,
                  top: `${piece.position.y}%`,
                }}
                onClick={() => handlePieceClick(piece.id)}
              >
                <div className="text-2xl mb-1">{piece.icon}</div>
                <div className="font-semibold text-sm">{piece.name}</div>
                <div className="text-xs text-gray-600">{piece.description}</div>
                {piece.type === 'source' && <Badge variant="destructive" className="text-xs mt-1">Source</Badge>}
                {piece.type === 'gas' && <Badge variant="secondary" className="text-xs mt-1">Gas</Badge>}
                {piece.type === 'effect' && <Badge variant="outline" className="text-xs mt-1">Effect</Badge>}
                {piece.type === 'solution' && <Badge className="text-xs mt-1">Solution</Badge>}
              </div>
            ))}
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">How to Play:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Click on two pieces to connect them</li>
              <li>• Connect sources to the gases they produce</li>
              <li>• Connect gases to their effects</li>
              <li>• Connect effects to their solutions</li>
              <li>• Complete all connections in 2 minutes!</li>
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

export default GreenhouseGasPuzzle;
