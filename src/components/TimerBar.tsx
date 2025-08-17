import React from 'react';
import { Button } from '@/components/ui/button';
import { Exercise } from './WorkoutTimer';

interface TimerBarProps {
  exercise: Exercise;
  onComplete: () => void;
}

export const TimerBar: React.FC<TimerBarProps> = ({ exercise, onComplete }) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBarClasses = () => {
    switch (exercise.status) {
      case 'active':
        return 'bg-timer-active text-timer-active-foreground';
      case 'ready':
        return 'bg-timer-ready text-timer-ready-foreground';
      case 'completed':
        return 'bg-timer-inactive text-timer-inactive-foreground';
      default:
        return 'bg-timer-inactive text-timer-inactive-foreground';
    }
  };

  const getProgressWidth = () => {
    if (exercise.status === 'ready') return '100%';
    if (exercise.status === 'completed') return '100%';
    if (exercise.duration === 0) return '0%';
    
    const progress = ((exercise.duration - exercise.timeRemaining) / exercise.duration) * 100;
    return `${Math.max(0, Math.min(100, progress))}%`;
  };

  return (
    <div className="relative overflow-hidden rounded-md h-12 bg-timer-inactive transition-all duration-300">
      {/* Progress bar background */}
      <div 
        className={`absolute inset-0 transition-all duration-1000 ease-out ${getBarClasses()}`}
        style={{ width: getProgressWidth() }}
      />
      
      {/* Content */}
      <div className="relative flex items-center justify-between h-full px-3 z-10">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{exercise.name}</span>
          <span className="text-xs opacity-75">
            {formatTime(exercise.timeRemaining)}
          </span>
        </div>
        
        {exercise.status === 'ready' && (
          <Button
            onClick={onComplete}
            size="sm"
            variant="secondary"
            className="h-8 px-3 text-xs bg-white/90 text-black hover:bg-white"
          >
            Done
          </Button>
        )}
        
        {exercise.status === 'active' && (
          <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
        )}
      </div>
    </div>
  );
};