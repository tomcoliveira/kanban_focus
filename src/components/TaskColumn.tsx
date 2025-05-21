import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';
import TaskInput from './TaskInput';
import { useTaskStore } from '../store/taskStore';
import { ColumnType } from '../types';
import { Plus } from 'lucide-react';

interface TaskColumnProps {
  id: ColumnType;
  title: string;
  icon: React.ReactNode;
}

const TaskColumn: React.FC<TaskColumnProps> = ({ id, title, icon }) => {
  const tasks = useTaskStore(state => state.getTasksByColumn(id));
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div 
      className={`flex flex-col h-[calc(100vh-180px)] bg-surface/30 rounded-lg ${
        isOver ? 'ring-2 ring-primary/50' : ''
      } transition-all relative overflow-hidden`}
    >
      
      <div className="p-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className={`font-medium text-xl tracking-tight ${id === 'em_andamento' ? 'text-primary' : 'text-white'}`}>{title}</h3>
          <span className="text-xs bg-black/30 px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>
      
      <div 
        ref={setNodeRef}
        className="flex-1 p-4 overflow-y-auto relative"
      >
        <div className="flex flex-col gap-2">
          {tasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
            />
          ))}
          {tasks.length === 0 && (
            <div className="text-sm text-center py-4 text-text-secondary flex flex-col items-center">
              <span>No tasks</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskColumn;