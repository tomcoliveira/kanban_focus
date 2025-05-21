import React from 'react';
import { useTaskStore } from '../store/taskStore';
import { formatTimeHHMMSS } from '../utils/formatTime';
import { BarChart3, Clock, CheckCheck, AlertCircle } from 'lucide-react';

const TaskReport: React.FC = () => {
  const tasks = useTaskStore(state => state.tasks);
  
  // Calculate statistics
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.column === 'finalizada').length,
    inProgress: tasks.filter(t => t.column === 'em_andamento').length,
    highPriority: tasks.filter(t => t.priority === 'high').length,
    totalTimeSpent: tasks.reduce((acc, task) => acc + task.timeSpent, 0),
    averageTimePerTask: tasks.length ? 
      tasks.reduce((acc, task) => acc + task.timeSpent, 0) / tasks.length : 
      0
  };

  return (
    <div className="bg-surface/30 rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Task Status */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Total Tasks</span>
              <span className="text-white font-mono">{stats.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Completed</span>
              <span className="text-success font-mono">{stats.completed}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">In Progress</span>
              <span className="text-primary font-mono">{stats.inProgress}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">High Priority</span>
              <span className="text-error font-mono">{stats.highPriority}</span>
            </div>
          </div>
        </div>

        {/* Time Tracking */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Total Time</span>
              <span className="text-white font-mono">{formatTimeHHMMSS(stats.totalTimeSpent)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Average Time/Task</span>
              <span className="text-white font-mono">{formatTimeHHMMSS(stats.averageTimePerTask)}</span>
            </div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="space-y-4">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div className="text-text-secondary">
                {((stats.completed / stats.total) * 100).toFixed(1)}% Complete
              </div>
            </div>
            <div className="overflow-hidden h-2 text-xs flex rounded bg-surface">
              <div
                style={{ width: `${(stats.completed / stats.total) * 100}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-success"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskReport;