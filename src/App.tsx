import React from 'react';
import TaskBoard from './components/TaskBoard';
import FocusMode from './components/FocusMode';
import Header from './components/Header';
import TaskReport from './components/TaskReport';
import TaskInput from './components/TaskInput';
import { useTaskStore } from './store/taskStore';

function App() {
  const focusedTask = useTaskStore(state => state.getFocusedTask());
  const showFocusMode = Boolean(focusedTask);

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col">
      {showFocusMode ? (
        <FocusMode task={focusedTask!} />
      ) : (
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 p-4">
            <div className="mb-6">
              <TaskReport />
            </div>
            <TaskBoard />
          </main>
          <footer className="p-4 border-t border-white/10">
            <div className="container mx-auto">
              <TaskInput />
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}

export default App;