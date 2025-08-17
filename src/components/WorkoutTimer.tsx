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
          const activeIndex = updated.findIndex(ex => ex.status === 'active');
          
          if (activeIndex !== -1) {
            const activeExercise = updated[activeIndex];
            if (activeExercise.timeRemaining > 0) {
              activeExercise.timeRemaining -= 1;
            } else {
              activeExercise.status = 'ready';
              toast({
                title: `${activeExercise.name} is ready!`,
                description: "Time to exercise! Click the button when done.",
                variant: "default",
              });
            }
          }
          
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
      setExercises(prev => prev.map((ex, index) => {
        const isValid = ex.name.trim() && ex.duration > 0;
        const validIndex = validExercises.findIndex(valid => valid.id === ex.id);
        return {
          ...ex,
          status: isValid && validIndex === 0 ? 'active' : 'waiting',
          timeRemaining: ex.duration * 60 // convert minutes to seconds
        };
      }));
      setIsSetupMode(false);
      setIsTimerActive(true);
    }
  };

  const completeExercise = (id: number) => {
    setExercises(prev => {
      const updated = [...prev];
      const validExercises = updated.filter(ex => ex.name.trim() && ex.duration > 0);
      const currentIndex = validExercises.findIndex(ex => ex.id === id);
      const nextExercise = validExercises[currentIndex + 1];
      
      // Mark current as completed
      const exerciseIndex = updated.findIndex(ex => ex.id === id);
      if (exerciseIndex !== -1) {
        updated[exerciseIndex].status = 'completed';
        updated[exerciseIndex].timeRemaining = updated[exerciseIndex].duration * 60;
      }
      
      // Start next exercise if exists
      if (nextExercise) {
        const nextIndex = updated.findIndex(ex => ex.id === nextExercise.id);
        if (nextIndex !== -1) {
          updated[nextIndex].status = 'active';
        }
      }
      
      return updated;
    });
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
      <Card className="w-80 p-6 bg-timer-background border-border">
        <h2 className="text-lg font-semibold mb-4 text-foreground">Setup Your Workout</h2>
        <div className="space-y-4">
          {exercises.map((exercise, index) => (
            <div key={exercise.id} className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Exercise {index + 1}</Label>
              <Input
                placeholder="Exercise name"
                value={exercise.name}
                onChange={(e) => handleExerciseChange(exercise.id, 'name', e.target.value)}
                className="text-sm"
              />
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Duration"
                  value={exercise.duration}
                  onChange={(e) => handleExerciseChange(exercise.id, 'duration', e.target.value)}
                  className="text-sm"
                  min="1"
                />
                <span className="text-sm text-muted-foreground">minutes</span>
              </div>
            </div>
          ))}
          <Button onClick={startTimer} className="w-full mt-4">
            Start Workout
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="w-80 space-y-1 bg-timer-background p-3 rounded-lg border border-border">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-foreground">Workout Timer</h3>
        <Button 
          onClick={resetTimer} 
          variant="outline" 
          size="sm"
          className="text-xs h-6 px-2"
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