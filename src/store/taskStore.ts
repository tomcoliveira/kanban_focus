import { create } from 'zustand';
import { ColumnType, Task, TaskStoreState } from '../types';

interface NewTask {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: number;
  timeSpent?: number;
}

export const useTaskStore = create<TaskStoreState>((set, get) => ({
  tasks: [],
  clickUpConfig: null,

  // Initialize ClickUp config
  initClickUpConfig: () => {
    set({
      clickUpConfig: {
        apiKey: 'pk_42977582_SID0A4XAF5BMA4E9IFT254KJGFK01C5F',
        listId: '901305833574'
      }
    });
    get().saveToStorage();
  },

  // Actions
  setClickUpConfig: (config: ClickUpConfig) => {
    set({ clickUpConfig: config });
    get().saveToStorage();
  },

  addTask: (taskData: NewTask) => {
    const newTask: Task = {
      id: Date.now().toString(),
      ...taskData, 
      createdAt: Date.now(),
      updatedAt: Date.now(),
      timeSpent: taskData.timeSpent || 0,
    };

    set((state) => {
      const updatedTasks = [...state.tasks, newTask];
      return { tasks: updatedTasks };
    });
    get().saveToStorage();
  },

  moveTask: (taskId: string, targetColumn: ColumnType) => {
    // If target column is 'em_andamento', we need to ensure only one task is there
    if (targetColumn === 'em_andamento') {
      set((state) => {
        const taskToMove = state.tasks.find(t => t.id === taskId);
        if (!taskToMove) return state;

        // First move any existing 'em_andamento' task to 'sprint'
        const updatedTasks = state.tasks.map(task => {
          if (task.column === 'em_andamento' && task.id !== taskId) {
            return {
              ...task,
              column: 'sprint' as ColumnType,
              updatedAt: Date.now(),
            };
          }
          return task;
        });

        // Then move the target task to 'doing' and set lastActiveAt timestamp
        return {
          tasks: updatedTasks.map(task => {
            if (task.id === taskId) {
              return {
                ...task,
                column: targetColumn,
                updatedAt: Date.now(),
                lastActiveAt: Date.now()
              };
            }
            return task;
          })
        };
      });
    } else {
      // For other columns, just move the task
      set((state) => ({
        tasks: state.tasks.map(task => {
          if (task.id === taskId) {
            return {
              ...task,
              column: targetColumn,
              updatedAt: Date.now(),
            };
          }
          return task;
        })
      }));
    }
    get().saveToStorage();
  },

  startTask: (taskId: string) => {
    get().moveTask(taskId, 'em_andamento');
  },

  stopTask: (taskId: string) => {
    set((state) => {
      const taskIndex = state.tasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return state;

      const task = state.tasks[taskIndex];
      if (task.column !== 'em_andamento') return state;

      const now = Date.now();
      const elapsed = task.lastActiveAt ? now - task.lastActiveAt : 0;
      
      const updatedTasks = [...state.tasks];
      updatedTasks[taskIndex] = {
        ...task,
        column: 'sprint',
        timeSpent: task.timeSpent + elapsed,
        updatedAt: now,
        lastActiveAt: undefined
      };

      return { tasks: updatedTasks };
    });
    get().saveToStorage();
  },

  removeTask: (taskId: string) => {
    set((state) => ({
      tasks: state.tasks.filter(task => task.id !== taskId)
    }));
    get().saveToStorage();
  },

  // Getters
  getTasksByColumn: (column: ColumnType) => {
    return get().tasks.filter(task => task.column === column)
      .sort((a, b) => b.updatedAt - a.updatedAt);
  },

  getFocusedTask: () => {
    return get().tasks.find(task => task.column === 'em_andamento') || null;
  },

  setClickUpConfig: (config: ClickUpConfig) => {
    set({ clickUpConfig: config });
    get().saveToStorage();
  },

  syncWithClickUp: async () => {
    const config = get().clickUpConfig;
    if (!config) return;

    try {
      const response = await fetch(`https://api.clickup.com/api/v2/list/${config.listId}/task`, {
        headers: {
          'Authorization': config.apiKey,
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tasks from ClickUp');
      }

      const data = await response.json();
      const mappedTasks = data.tasks.map((task: any) => ({
        id: task.id.toString(),
        title: task.name,
        description: task.description || '',
        priority: task.priority?.priority_normalized || 'medium',
        column: mapClickUpStatusToColumn(task.status.status),
        createdAt: new Date(task.date_created).getTime(),
        updatedAt: new Date(task.date_updated).getTime(),
        timeSpent: task.time_spent || 0
      }));

      set({ tasks: mappedTasks });
      get().saveToStorage();
    } catch (error) {
      console.error('Failed to sync with ClickUp:', error);
      throw error;
    }
  },

  // Storage
  loadFromStorage: () => {
    try {
      const storedTasks = localStorage.getItem('scrumFocusTasks');
      const storedConfig = localStorage.getItem('scrumFocusClickUpConfig');
      
      if (storedTasks) {
        set({ tasks: JSON.parse(storedTasks) });
      }
      if (storedConfig) {
        set({ clickUpConfig: JSON.parse(storedConfig) });
      }
    } catch (error) {
      console.error('Failed to load tasks from localStorage:', error);
    }
  },

  saveToStorage: () => {
    try {
      localStorage.setItem('scrumFocusTasks', JSON.stringify(get().tasks));
      if (get().clickUpConfig) {
        localStorage.setItem('scrumFocusClickUpConfig', JSON.stringify(get().clickUpConfig));
      }
    } catch (error) {
      console.error('Failed to save tasks to localStorage:', error);
    }
  }
}));

// Load tasks from storage on initialization
if (typeof window !== 'undefined') {
  useTaskStore.getState().loadFromStorage();
}