import React, { useState, useEffect, useCallback } from 'react';
import { Task } from '../types';
import { useTaskStore } from '../store/taskStore';
import { format } from 'date-fns';
import { X } from 'lucide-react';

interface FocusModeProps {
  task: Task;
}

const FocusMode: React.FC<FocusModeProps> = ({ task }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState(0);
  const stopTask = useTaskStore(state => state.stopTask);

  // Update current time and elapsed time
  useEffect(() => {
    let animationFrameId: number;
    
    const updateTime = () => {
      setCurrentTime(new Date());
      if (task.lastActiveAt) {
        const elapsed = Date.now() - task.lastActiveAt + task.timeSpent;
        setElapsedTime(elapsed);
      }
      animationFrameId = requestAnimationFrame(updateTime);
    };
    
    animationFrameId = requestAnimationFrame(updateTime);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [task.lastActiveAt, task.timeSpent]);

  // Handle exit focus mode
  const handleExitFocus = useCallback(() => {
    stopTask(task.id);
  }, [stopTask, task.id]);

  // Add keyboard event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        handleExitFocus();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleExitFocus]);

  // Format time as hours:minutes:seconds
  const formatElapsedTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="absolute top-4 right-4">
        <span className="text-text-secondary text-sm">
          {format(currentTime, 'EEEE, MMMM d · hh:mm a')}
        </span>
      </div>
      
      <div className="max-w-md w-full text-center">
        <h1 className="text-xl md:text-2xl font-medium mb-4 animate-slide-up">
          FOCUSING ON
        </h1>
        <h2 className="text-2xl md:text-4xl font-bold mb-8 animate-slide-up">{task.title}</h2>
        
        <div className="font-mono text-5xl md:text-7xl font-bold tracking-wider mb-10 text-primary animate-pulse-light">
          {formatElapsedTime(elapsedTime)}
        </div>
        
        <button
          onClick={handleExitFocus}
          className="bg-surface hover:bg-surface-hover text-white px-6 py-3 rounded-md flex items-center justify-center mx-auto transition-colors"
        >
          <X className="mr-2" size={18} />
          <span>Exit Focus (ESC or Enter)</span>
        </button>
      </div>
    </div>
  );
};

export default FocusMode;