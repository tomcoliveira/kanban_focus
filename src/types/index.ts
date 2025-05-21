export type ColumnType = 'backlog' | 'sprint' | 'em_andamento' | 'em_aprovacao' | 'finalizada';

export interface Task {
  id: string;
  title: string;
  responsible?: string;
  description: string;
  dueDate?: number;
  priority: 'low' | 'medium' | 'high';
  column: ColumnType;
  createdAt: number;
  updatedAt: number;
  timeSpent: number; // in milliseconds
  lastActiveAt?: number; // timestamp when task was last moved to 'doing'
}

export interface ClickUpConfig {
  apiKey: string;
  listId: string;
}

export interface TaskStore {
  tasks: Task[];
  clickUpConfig: ClickUpConfig | null;
  
  // Actions
  addTask: (title: string) => void;
  moveTask: (taskId: string, column: ColumnType) => void;
  startTask: (taskId: string) => void;
  stopTask: (taskId: string) => void;
  removeTask: (taskId: string) => void;
  syncWithClickUp: () => Promise<void>;
  setClickUpConfig: (config: ClickUpConfig) => void;
  
  // Getters
  getTasksByColumn: (column: ColumnType) => Task[];
  getFocusedTask: () => Task | null;
}

export interface TaskStoreState extends TaskStore {
  // persist helper
  loadFromStorage: () => void;
  saveToStorage: () => void;
}