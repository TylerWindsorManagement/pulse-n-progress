import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { TimerBar } from './TimerBar';
import { useToast } from '@/hooks/use-toast';

export interface Exercise {
  id: number;
  name: string;
  duration: number; // in minutes
  status: 'waiting' | 'active' | 'ready' | 'completed';
  timeRemaining: number; // in seconds
}

const WorkoutTimer = () => {
  const [exercises, setExercises] = useState<Exercise[]>([
    { id: 1, name: '', duration: 0, status: 'waiting', timeRemaining: 0 },
    { id: 2, name: '', duration: 0, status: 'waiting', timeRemaining: 0 },
    { id: 3, name: '', duration: 0, status: 'waiting', timeRemaining: 0 },
  ]);
  const [isSetupMode, setIsSetupMode] = useState(true);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerActive && !isSetupMode) {
      interval = setInterval(() => {
        setExercises(prev => {
          const updated = [...prev];
          
          updated.forEach((exercise, index) => {
            if (exercise.status === 'active' && exercise.timeRemaining > 0) {
              exercise.timeRemaining -= 1;
            } else if (exercise.status === 'active' && exercise.timeRemaining === 0) {
              exercise.status = 'ready';
            }
          });
          
          return updated;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerActive, isSetupMode, toast]);

  const handleExerciseChange = (id: number, field: 'name' | 'duration', value: string) => {
    setExercises(prev => prev.map(ex => 
      ex.id === id 
        ? { 
            ...ex, 
            [field]: field === 'duration' ? parseInt(value) || 0 : value,
            timeRemaining: field === 'duration' ? (parseInt(value) || 0) * 60 : ex.timeRemaining
          }
        : ex
    ));
  };

  const startTimer = () => {
    const validExercises = exercises.filter(ex => ex.name.trim() && ex.duration > 0);
    if (validExercises.length > 0) {
      setExercises(prev => prev.map(ex => {
        const isValid = ex.name.trim() && ex.duration > 0;
        return {
          ...ex,
          status: isValid ? 'ready' : 'waiting', // Start all valid exercises in ready state
          timeRemaining: ex.duration * 60 // convert minutes to seconds
        };
      }));
      setIsSetupMode(false);
      setIsTimerActive(true);
    }
  };

  const completeExercise = (id: number) => {
    setExercises(prev => prev.map(ex => 
      ex.id === id 
        ? { 
            ...ex, 
            status: 'active',
            timeRemaining: ex.duration * 60
          }
        : ex
    ));
  };

  const resetTimer = () => {
    setExercises(prev => prev.map(ex => ({
      ...ex,
      status: 'waiting',
      timeRemaining: ex.duration * 60 // convert minutes to seconds
    })));
    setIsSetupMode(true);
    setIsTimerActive(false);
  };

  if (isSetupMode) {
    return (
      <Card className="w-64 p-3 bg-timer-background border-border">
        <h2 className="text-sm font-medium mb-3 text-foreground">Setup Workout</h2>
        <div className="space-y-2">
          {exercises.map((exercise, index) => (
            <div key={exercise.id} className="space-y-1">
              <Label className="text-xs text-foreground">Ex {index + 1}</Label>
              <Input
                placeholder="Exercise name"
                value={exercise.name}
                onChange={(e) => handleExerciseChange(exercise.id, 'name', e.target.value)}
                className="text-xs h-7"
              />
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  placeholder="Min"
                  value={exercise.duration}
                  onChange={(e) => handleExerciseChange(exercise.id, 'duration', e.target.value)}
                  className="text-xs h-7 w-16"
                  min="1"
                />
                <span className="text-xs text-muted-foreground">min</span>
              </div>
            </div>
          ))}
          <Button onClick={startTimer} className="w-full mt-3 h-7 text-xs">
            Start
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="w-64 space-y-0.5 bg-timer-background p-2 rounded-lg border border-border">
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-xs font-medium text-foreground">Workout</h3>
        <Button 
          onClick={resetTimer} 
          variant="outline" 
          size="sm"
          className="text-xs h-5 px-1.5"
        >
          Reset
        </Button>
      </div>
      {exercises
        .filter(exercise => exercise.name.trim() && exercise.duration > 0)
        .map((exercise) => (
          <TimerBar
            key={exercise.id}
            exercise={exercise}
            onComplete={() => completeExercise(exercise.id)}
          />
        ))}
    </div>
  );
};

export default WorkoutTimer;