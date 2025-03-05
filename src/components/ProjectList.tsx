import React, { useState } from 'react';
import { Project as ProjectType, Priority } from '../types';
import { Project } from './Project';

const initialProjects: ProjectType[] = [];

export const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<ProjectType[]>(initialProjects);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [newProjectPriority, setNewProjectPriority] =
    useState<Priority>('medium');
  const [newProjectDueDate, setNewProjectDueDate] = useState('');

  const handleToggleTodo = (todoId: number) => {
    setProjects(prevProjects =>
      prevProjects.map(project => ({
        ...project,
        todoLists: project.todoLists.map(list => ({
          ...list,
          todos: list.todos.map(todo =>
            todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
          ),
        })),
      }))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newProjectTitle.trim()) return;

    const newProject: ProjectType = {
      id: Math.max(...projects.map(p => p.id), 0) + 1,
      title: newProjectTitle.trim(),
      description: newProjectDescription.trim(),
      priority: newProjectPriority,
      dueDate: newProjectDueDate || null,
      todoLists: [],
    };

    setProjects([...projects, newProject]);
    setNewProjectTitle('');
    setNewProjectDescription('');
    setNewProjectPriority('medium');
    setNewProjectDueDate('');
  };

  const handleDeleteProject = (projectId: number) => {
    setProjects(projects.filter(project => project.id !== projectId));
  };

  const handleUpdateProjectPriority = (
    projectId: number,
    priority: Priority
  ) => {
    setProjects(
      projects.map(project =>
        project.id === projectId ? { ...project, priority } : project
      )
    );
  };

  const handleUpdateProjectDueDate = (
    projectId: number,
    dueDate: string | null
  ) => {
    setProjects(
      projects.map(project =>
        project.id === projectId ? { ...project, dueDate } : project
      )
    );
  };

  const handleAddTodoList = (projectId: number, title: string) => {
    setProjects(
      projects.map(project => {
        if (project.id === projectId) {
          const newTodoList = {
            id: Math.max(...project.todoLists.map(list => list.id), 0) + 1,
            title,
            todos: [],
            priority: 'medium' as Priority,
          };
          return {
            ...project,
            todoLists: [...project.todoLists, newTodoList],
          };
        }
        return project;
      })
    );
  };

  const handleUpdateTodoList = (
    projectId: number,
    listId: number,
    updates: Partial<ProjectType['todoLists'][0]>
  ) => {
    setProjects(
      projects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            todoLists: project.todoLists.map(list =>
              list.id === listId ? { ...list, ...updates } : list
            ),
          };
        }
        return project;
      })
    );
  };

  return (
    <div
      className="project-list"
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
      }}
    >
      <h1
        style={{
          textAlign: 'center',
          color: '#333',
          marginBottom: '30px',
        }}
      >
        Project Management System
      </h1>

      <div
        style={{
          marginBottom: '30px',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
        }}
      >
        <h2>Add New Project</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input
              type="text"
              value={newProjectTitle}
              onChange={e => setNewProjectTitle(e.target.value)}
              placeholder="Project Title"
              style={{ padding: '8px', flex: 1 }}
              required
            />
            <select
              value={newProjectPriority}
              onChange={e => setNewProjectPriority(e.target.value as Priority)}
              style={{ padding: '8px' }}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <textarea
              value={newProjectDescription}
              onChange={e => setNewProjectDescription(e.target.value)}
              placeholder="Project Description"
              style={{ width: '100%', padding: '8px', minHeight: '80px' }}
              required
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label
              htmlFor="projectDueDate"
              style={{ display: 'block', marginBottom: '5px' }}
            >
              Due Date (optional)
            </label>
            <input
              id="projectDueDate"
              type="date"
              value={newProjectDueDate}
              onChange={e => setNewProjectDueDate(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            Add Project
          </button>
        </form>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {projects
          .sort((a, b) => {
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
          })
          .map(project => (
            <Project
              key={project.id}
              project={project}
              onToggleTodo={handleToggleTodo}
              onDelete={() => handleDeleteProject(project.id)}
              onUpdatePriority={priority =>
                handleUpdateProjectPriority(project.id, priority)
              }
              onUpdateDueDate={dueDate =>
                handleUpdateProjectDueDate(project.id, dueDate)
              }
              onAddTodoList={title => handleAddTodoList(project.id, title)}
              onUpdateTodoList={(listId, updates) =>
                handleUpdateTodoList(project.id, listId, updates)
              }
            />
          ))}
      </div>
    </div>
  );
};
