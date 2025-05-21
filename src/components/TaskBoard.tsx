import React from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import TaskColumn from './TaskColumn';
import TaskCard from './TaskCard';
import { useTaskStore } from '../store/taskStore';
import { ColumnType, Task } from '../types';
import { ClipboardList, Library, ListChecks, Play, Clock, CheckSquare, CheckCheck } from 'lucide-react';

const columns: { id: ColumnType; title: string; icon: React.ReactNode }[] = [
  { id: 'backlog', title: 'Backlog', icon: <ClipboardList className="h-4 w-4" /> },
  { id: 'sprint', title: 'Sprint', icon: <ListChecks className="h-4 w-4" /> },
  { id: 'em_andamento', title: 'Em Andamento', icon: <Play className="h-4 w-4" /> },
  { id: 'em_aprovacao', title: 'Em Aprovação', icon: <CheckSquare className="h-4 w-4" /> },
  { id: 'finalizada', title: 'Finalizada', icon: <CheckCheck className="h-4 w-4" /> },
];

const TaskBoard: React.FC = () => {
  const [activeTask, setActiveTask] = React.useState<Task | null>(null);
  const moveTask = useTaskStore(state => state.moveTask);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const taskId = active.id as string;
    const tasks = columns.flatMap(column => 
      useTaskStore.getState().getTasksByColumn(column.id)
    );
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const targetColumn = over.id as ColumnType;

    if (targetColumn && columns.find(col => col.id === targetColumn)) {
      moveTask(taskId, targetColumn);
    }
    
    setActiveTask(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 h-full pb-4">
        {columns.map(column => (
          <div key={column.id} className="flex-1 min-w-[250px]">
            <TaskColumn id={column.id} title={column.title} icon={column.icon} />
          </div>
        ))}
      </div>
      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  );
};

export default TaskBoard;