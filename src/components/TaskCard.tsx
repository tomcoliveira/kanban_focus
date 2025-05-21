import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Task } from '../types';
import { Trash2, Play, Calendar, Flag } from 'lucide-react';
import { useTaskStore } from '../store/taskStore';
import { formatDistanceToNow, format } from 'date-fns';

const priorityColors = {
  low: 'text-gray-400',
  medium: 'text-yellow-500',
  high: 'text-red-500'
};

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, isDragging = false }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });
  const removeTask = useTaskStore(state => state.removeTask);
  const startTask = useTaskStore(state => state.startTask);

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeTask(task.id);
  };

  const handleStartTask = (e: React.MouseEvent) => {
    e.stopPropagation();
    startTask(task.id);
  };

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 10,
  } : undefined;

  // Format time spent in hh:mm:ss
  const formatTimeSpent = (ms: number) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`p-3 cursor-grab transition-colors ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } hover:bg-white/5 border-l border-primary`}
    >
      <div className="flex justify-between items-start gap-2">
        <h4 className="task-title flex-1 text-white">{task.title}</h4>
        <div className="flex items-center gap-1">
          {task.column !== 'em_andamento' && !['aprovada', 'finalizada'].includes(task.column) && (
            <button
              onClick={handleStartTask}
              className="text-primary hover:text-white p-1 rounded"
              title="Start working on this task"
            >
              <Play size={16} />
            </button>
          )}
          <button
            onClick={handleRemove}
            className="text-error hover:text-white p-1 rounded"
            title="Remove task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      {task.description && (
        <p className="text-xs text-text-secondary mt-2 line-clamp-1">{task.description}</p>
      )}
      {task.responsible && (
        <p className="text-xs text-primary mt-1">
          Responsible: {task.responsible}
        </p>
      )}
      <div className="flex items-center gap-2 mt-2">
        {task.dueDate && (
          <div className="flex items-center text-xs text-text-secondary">
            <Calendar size={12} className="mr-1" />
            {format(task.dueDate, 'dd/MM/yyyy')}
          </div>
        )}
        <Flag size={12} className={`${priorityColors[task.priority]}`} />
      </div>
      
      <div className="flex justify-between mt-2 text-text-secondary text-xs">
        <span title="Created">
          {formatDistanceToNow(task.createdAt, { addSuffix: true })}
        </span>
        {task.timeSpent > 0 && (
          <span title="Time spent" className="font-mono">
            {formatTimeSpent(task.timeSpent)}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;