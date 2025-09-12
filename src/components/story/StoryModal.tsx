import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Play, Pause, X } from 'lucide-react';

interface StorySlide {
  id: number;
  image: string;
  title: string;
  text: string;
  duration: number; // in milliseconds
}

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  level: number;
}

export const StoryModal: React.FC<StoryModalProps> = ({
  isOpen,
  onClose,
  level
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Story data for different levels
  const getStoryData = (level: number) => {
    const stories = {
      1: {
        title: "Climate Change Crisis",
        slides: [
          {
            id: 1,
            image: "https://images.unsplash.com/photo-1569163139394-de446b8b4e8c?w=1200&h=800&fit=crop&crop=center",
            title: "Punjab's Climate Challenge",
            text: "Punjab, known as the breadbasket of India, faces unprecedented climate challenges. Rising temperatures, changing rainfall patterns, and extreme weather events threaten our agricultural heritage and way of life.",
            duration: 6000
          },
          {
            id: 2,
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop&crop=center",
            title: "The Greenhouse Effect",
            text: "Greenhouse gases like carbon dioxide and methane trap heat in our atmosphere, causing global temperatures to rise. In Punjab, this means hotter summers, unpredictable monsoons, and threats to our crops.",
            duration: 5000
          },
          {
            id: 3,
            image: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=1200&h=800&fit=crop&crop=center",
            title: "Your Mission Begins",
            text: "As a young environmental hero, you must master the science of climate change to protect Punjab's future. Your knowledge and actions can help build a sustainable tomorrow for our beautiful state.",
            duration: 5000
          }
        ]
      },
      2: {
        title: "Waste Management Revolution",
        slides: [
          {
            id: 1,
            image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop&crop=center",
            title: "Punjab's Waste Crisis",
            text: "Every day, Punjab generates thousands of tons of waste. From plastic bottles in our rivers to organic waste in our fields, we need innovative solutions to manage our resources better.",
            duration: 6000
          },
          {
            id: 2,
            image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=1200&h=800&fit=crop&crop=center",
            title: "The 3R Revolution",
            text: "Reduce, Reuse, Recycle - these three principles can transform how we handle waste. By following the 3Rs, we can minimize waste, conserve resources, and protect Punjab's environment.",
            duration: 5000
          },
          {
            id: 3,
            image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&h=800&fit=crop&crop=center",
            title: "Circular Economy",
            text: "Imagine a world where waste becomes a resource! The circular economy turns our waste into valuable materials, creating jobs and protecting our environment for future generations.",
            duration: 5000
          }
        ]
      }
    };

    return stories[level as keyof typeof stories] || stories[1];
  };

  const storyData = getStoryData(level);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || !isOpen) return;

    const slide = storyData.slides[currentSlide];
    const duration = slide?.duration || 5000;

    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 100;
        if (newProgress >= duration) {
          nextSlide();
          return 0;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isPlaying, currentSlide, isOpen, storyData.slides]);

  const nextSlide = () => {
    if (currentSlide < storyData.slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
      setProgress(0);
    } else {
      setIsPlaying(false);
    }
  };

  const previousSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      setProgress(0);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const startStory = () => {
    setCurrentSlide(0);
    setProgress(0);
    setIsPlaying(true);
  };

  const currentSlideData = storyData.slides[currentSlide];

  if (!currentSlideData) return null;

  const progressPercentage = (progress / (currentSlideData.duration || 5000)) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full h-[90vh] p-0 overflow-hidden bg-black">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              📖
            </div>
            <h1 className="text-xl font-bold">{storyData.title}</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 relative flex">
          {/* Image Section */}
          <div className="w-1/2 relative">
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${currentSlideData.image})`
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            
            {/* Slide Counter */}
            <div className="absolute top-4 right-4 bg-black/70 rounded-full px-3 py-1 text-white text-sm font-medium">
              {currentSlide + 1} / {storyData.slides.length}
            </div>
          </div>

          {/* Text Section */}
          <div className="w-1/2 bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 flex flex-col justify-center">
            <div className="max-w-lg">
              <h2 className="text-3xl font-bold mb-6 text-white">
                {currentSlideData.title}
              </h2>
              <p className="text-lg leading-relaxed text-gray-200 mb-8">
                {currentSlideData.text}
              </p>
              
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-100 ease-linear"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="text-sm text-gray-400 mt-2 text-center">
                  {Math.round(progressPercentage)}% complete
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={previousSlide}
                  disabled={currentSlide === 0}
                  className="text-white border-white/30 hover:bg-white/10 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>

                <Button
                  onClick={togglePlayPause}
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-6"
                >
                  {isPlaying ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextSlide}
                  disabled={currentSlide === storyData.slides.length - 1}
                  className="text-white border-white/30 hover:bg-white/10 disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Start Button Overlay (only show on first slide if not playing) */}
        {currentSlide === 0 && !isPlaying && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Ready to Begin?</h3>
              <p className="text-gray-300 mb-6">Click to start your environmental adventure</p>
              <Button
                onClick={startStory}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-3 text-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Story
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
