import React, { useState, useEffect } from 'react';
import { CheckCircle, X, Star, Gift, Trophy, Gamepad2 } from 'lucide-react';

interface NotificationToastProps {
  type: 'lesson' | 'game' | 'challenge' | 'module';
  title: string;
  message: string;
  rewards?: { [key: string]: number };
  xp?: number;
  onClose: () => void;
  duration?: number;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ 
  type, 
  title, 
  message, 
  rewards = {}, 
  xp = 0, 
  onClose, 
  duration = 5000 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'lesson': return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'game': return <Gamepad2 className="w-6 h-6 text-blue-500" />;
      case 'challenge': return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 'module': return <Star className="w-6 h-6 text-purple-500" />;
      default: return <Gift className="w-6 h-6 text-gray-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'lesson': return 'bg-green-50 border-green-200';
      case 'game': return 'bg-blue-50 border-blue-200';
      case 'challenge': return 'bg-yellow-50 border-yellow-200';
      case 'module': return 'bg-purple-50 border-purple-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-md w-full transform transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className={`${getBgColor()} border rounded-lg shadow-lg p-4`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{message}</p>
            
            {Object.keys(rewards).length > 0 && (
              <div className="mt-2">
                <div className="flex flex-wrap gap-2">
                  {Object.entries(rewards).map(([item, quantity]) => (
                    <span key={item} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white text-gray-800">
                      {quantity} {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {xp > 0 && (
              <div className="mt-2 flex items-center text-sm text-gray-600">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                +{xp} XP
              </div>
            )}
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;