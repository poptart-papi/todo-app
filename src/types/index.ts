export interface TodoItem {
  id: number;
  text: string;
  details: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface TodoList {
  id: number;
  title: string;
  todos: TodoItem[];
  priority: 'low' | 'medium' | 'high';
}

export interface Project {
  id: number;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string | null;
  todoLists: TodoList[];
}

export interface ProjectList {
  projects: Project[];
}

export type Priority = 'low' | 'medium' | 'high';
