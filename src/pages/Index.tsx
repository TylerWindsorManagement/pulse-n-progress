import WorkoutTimer from '@/components/WorkoutTimer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        
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
