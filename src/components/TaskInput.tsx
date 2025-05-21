import React, { useState, KeyboardEvent } from 'react';
import { Plus, Calendar, Flag, Clock } from 'lucide-react';
import { useTaskStore } from '../store/taskStore';
import { Task } from '../types';

interface TaskInputProps {
  onComplete?: () => void;
  defaultColumn?: 'backlog' | 'em_aprovacao' | 'finalizada';
}

const TaskInput: React.FC<TaskInputProps> = ({ onComplete, defaultColumn = 'backlog' }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [description, setDescription] = useState('');
  const [responsible, setResponsible] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [dueDate, setDueDate] = useState('');
  const [column, setColumn] = useState<'backlog' | 'em_aprovacao' | 'finalizada'>(defaultColumn);
  const [timeSpent, setTimeSpent] = useState('');
  const addTask = useTaskStore(state => state.addTask);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskTitle.trim()) {
      const timeInMs = timeSpent
        ? (parseInt(timeSpent) * 60 * 1000) // Convert minutes to milliseconds
        : 0;

      const newTask = {
        title: taskTitle.trim(),
        description: description.trim(),
        responsible: responsible.trim(),
        priority,
        dueDate: dueDate ? new Date(dueDate).getTime() : undefined,
        column,
        timeSpent: timeInMs
      };
      addTask(newTask);
      setTaskTitle('');
      setDescription('');
      setResponsible('');
      setPriority('medium');
      setDueDate('');
      setTimeSpent('');
      onComplete?.();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && e.target === e.currentTarget) {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-2">
      <div className="flex gap-2">
        <select
          value={column}
          onChange={(e) => setColumn(e.target.value as 'backlog' | 'em_aprovacao' | 'finalizada')}
          className="px-3 py-2 rounded-l bg-surface/50 text-text-primary border border-primary/20 focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="backlog">Backlog</option>
          <option value="em_aprovacao">Em Aprovação</option>
          <option value="finalizada">Finalizada</option>
        </select>
        <input
          type="text"
          placeholder="Task title..."
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-3 py-2 bg-surface/50 text-text-primary border border-primary/20 focus:outline-none focus:ring-1 focus:ring-primary"
          autoFocus
        />
        <button
          type="submit"
          className="bg-primary text-black px-3 py-2 rounded-r flex items-center transition-colors hover:bg-primary/90"
          aria-label="Add task"
        >
          <Plus size={18} />
        </button>
      </div>
      
      <div className="flex gap-2 items-start">
        <textarea
          placeholder="Task description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="flex-1 px-3 py-2 rounded bg-surface/50 text-text-primary border border-primary/20 focus:outline-none focus:ring-1 focus:ring-primary h-20 resize-none"
        />
        <div className="space-y-2 min-w-[200px]">
          <div className="flex items-center gap-2 bg-surface/50 p-2 rounded border border-primary/20">
            <input
              type="text"
              placeholder="Responsible"
              value={responsible}
              onChange={(e) => setResponsible(e.target.value)}
              className="w-full bg-transparent text-text-primary border-none focus:outline-none focus:ring-1 focus:ring-primary rounded"
            />
          </div>
          <div className="flex items-center gap-2 bg-surface/50 p-2 rounded border border-primary/20">
            <Flag size={16} className="text-primary" />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Task['priority'])}
              className="bg-transparent text-text-primary border-none focus:outline-none focus:ring-1 focus:ring-primary rounded"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2 bg-surface/50 p-2 rounded border border-primary/20">
            <Calendar size={16} className="text-primary" />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-transparent text-text-primary border-none focus:outline-none focus:ring-1 focus:ring-primary rounded"
            />
          </div>
          
          <div className="flex items-center gap-2 bg-surface/50 p-2 rounded border border-primary/20">
            <Clock size={16} className="text-primary" />
            <input
              type="number"
              min="0"
              placeholder="Time spent (minutes)"
              value={timeSpent}
              onChange={(e) => setTimeSpent(e.target.value)}
              className="bg-transparent text-text-primary border-none focus:outline-none focus:ring-1 focus:ring-primary rounded w-full"
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default TaskInput;