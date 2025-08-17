import WorkoutTimer from '@/components/WorkoutTimer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">VibeCode Workout Timer</h1>
          <p className="text-muted-foreground">Stay active with micro-workouts during your coding sessions</p>
        </div>
        
        <div className="flex justify-center">
          <WorkoutTimer />
        </div>
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Set up your exercises and place this timer in your screen corner for quick workouts!</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
