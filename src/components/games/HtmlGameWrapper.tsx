import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, RotateCcw, Play, Pause } from 'lucide-react';

interface HtmlGameWrapperProps {
  gameId: string;
  title: string;
  description: string;
  htmlContent: string;
  onComplete: () => void;
  onClose: () => void;
  isCompleted?: boolean;
}

const HtmlGameWrapper: React.FC<HtmlGameWrapperProps> = ({
  gameId,
  title,
  description,
  htmlContent,
  onComplete,
  onClose,
  isCompleted = false
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameScore, setGameScore] = useState<number | null>(null);

  console.log('HtmlGameWrapper rendered with:', { gameId, title, htmlContentLength: htmlContent.length });
  console.log('Rendering with portal to document.body');

  // Auto-start playing when content is loaded
  useEffect(() => {
    if (htmlContent && !isCompleted) {
      console.log('Auto-starting game with content length:', htmlContent.length);
      setIsPlaying(true);
    }
  }, [htmlContent, isCompleted]);

  // Debug iframe loading
  useEffect(() => {
    if (iframeRef.current && htmlContent) {
      console.log('Setting iframe content, length:', htmlContent.length);
      iframeRef.current.srcdoc = htmlContent;
      
      // Focus the iframe for keyboard events
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.focus();
          console.log('Iframe focused for keyboard events');
        }
      }, 100);
    }
  }, [htmlContent]);

  useEffect(() => {
    // Listen for messages from the iframe (if the game supports it)
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'GAME_COMPLETE') {
        setGameScore(event.data.score || 0);
        setIsPlaying(false);
        onComplete();
      } else if (event.data.type === 'GAME_SCORE') {
        setGameScore(event.data.score);
      }
    };

    // Forward keyboard events to iframe
    const handleKeyDown = (event: KeyboardEvent) => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        // Forward the event to the iframe
        iframeRef.current.contentWindow.postMessage({
          type: 'KEYBOARD_EVENT',
          key: event.key,
          code: event.code,
          keyCode: event.keyCode
        }, '*');
      }
    };

    window.addEventListener('message', handleMessage);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('message', handleMessage);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onComplete]);

  const handleStartGame = () => {
    setIsPlaying(true);
    setGameScore(null);
  };

  const handleRestartGame = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
    setGameScore(null);
    setIsPlaying(true);
  };

  const handleComplete = () => {
    setIsPlaying(false);
    onComplete();
  };

  // Safety check for SSR
  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 99999 }}>
      <Card className="w-full max-w-6xl max-h-[90vh] bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">{title}</CardTitle>
            <p className="text-gray-600 mt-1">{description}</p>
          </div>
          <div className="flex items-center space-x-2">
            {gameScore !== null && (
              <div className="text-sm font-medium text-green-600">
                Score: {gameScore}
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="relative">
            {!isPlaying && !isCompleted && (
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎮</div>
                  <h3 className="text-xl font-semibold mb-2">Ready to Play?</h3>
                  <p className="text-gray-600 mb-4">Click start to begin the game</p>
                  <Button onClick={handleStartGame} className="bg-green-600 hover:bg-green-700">
                    <Play className="w-4 h-4 mr-2" />
                    Start Game
                  </Button>
                </div>
              </div>
            )}
            
            {isCompleted && (
              <div className="absolute inset-0 bg-green-50 flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-xl font-semibold mb-2">Game Completed!</h3>
                  <p className="text-gray-600 mb-4">Great job! You've mastered this challenge.</p>
                  <div className="flex space-x-2">
                    <Button onClick={handleRestartGame} variant="outline">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Play Again
                    </Button>
                    <Button onClick={onClose} className="bg-green-600 hover:bg-green-700">
                      Continue
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <iframe
              ref={iframeRef}
              srcDoc={htmlContent}
              className="w-full h-[600px] border-0 cursor-pointer"
              title={title}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock allow-presentation allow-top-navigation allow-downloads"
              style={{ background: 'white' }}
              tabIndex={0}
              onLoad={() => {
                console.log('Iframe loaded successfully');
                // Focus the iframe for keyboard events
                setTimeout(() => {
                  if (iframeRef.current) {
                    iframeRef.current.focus();
                    iframeRef.current.contentWindow?.focus();
                    console.log('Iframe and content window focused after load');
                  }
                }, 500);
              }}
              onError={(e) => console.error('Iframe load error:', e)}
              onMouseEnter={() => {
                if (iframeRef.current) {
                  iframeRef.current.focus();
                  iframeRef.current.contentWindow?.focus();
                  console.log('Iframe focused on mouse enter');
                }
              }}
              onClick={() => {
                if (iframeRef.current) {
                  iframeRef.current.focus();
                  iframeRef.current.contentWindow?.focus();
                  console.log('Iframe focused on click');
                }
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
          
          <div className="p-4 bg-gray-50 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Environmental Disaster Survival Game • Click the game area and use arrow keys to move
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRestartGame}
                  disabled={!isPlaying}
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Restart
                </Button>
                {isPlaying && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleComplete}
                  >
                    Complete Game
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>,
    document.body
  );
};

export default HtmlGameWrapper;
