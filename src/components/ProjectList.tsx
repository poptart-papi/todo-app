import React, { useState, useEffect } from 'react';
import { Project as ProjectType, Priority } from '../types';
import { Project } from './Project';

const STORAGE_KEY = 'project-management-data';
const CURRENT_VERSION = 1;

export const ProjectList: React.FC = () => {
  useEffect(() => {
    // Check if we need to migrate data from older versions
    const storedVersion = localStorage.getItem(`${STORAGE_KEY}-version`);

    // If no version or older version, could run migration code here
    if (!storedVersion || parseInt(storedVersion) < CURRENT_VERSION) {
      // Run migration logic if needed

      // Update version
      localStorage.setItem(
        `${STORAGE_KEY}-version`,
        CURRENT_VERSION.toString()
      );
    }
  }, []);

  const checkStorageLimit = (data: ProjectType[]) => {
    try {
      const serializedData = JSON.stringify(data);
      const size = new Blob([serializedData]).size;

      // localStorage typically has ~5MB limit, warn at 4MB
      const warningThreshold = 4 * 1024 * 1024; // 4MB

      if (size > warningThreshold) {
        alert(
          `Warning: Your project data is getting large (${(
            size /
            (1024 * 1024)
          ).toFixed(2)}MB). ` +
            'Consider exporting and clearing some projects to avoid data loss.'
        );
      }

      return size;
    } catch (error) {
      console.error('Error checking storage size:', error);
      return 0;
    }
  };

  const loadProjectsFromStorage = (): ProjectType[] => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (!storedData) return [];

      const parsedData = JSON.parse(storedData);

      // Validate that we have an array
      if (!Array.isArray(parsedData)) {
        console.warn('Stored data is not an array, resetting to empty array');
        return [];
      }

      return parsedData.filter(project => {
        const isValid =
          typeof project === 'object' &&
          project !== null &&
          typeof project.id === 'number' &&
          typeof project.title === 'string';

        if (!isValid) {
          console.warn(
            'Found invalid project object, filtering it out',
            project
          );
        }
        return isValid;
      });
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      return [];
    }
  };

  const [projects, setProjects] = useState<ProjectType[]>(
    loadProjectsFromStorage()
  );
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [newProjectPriority, setNewProjectPriority] =
    useState<Priority>('medium');
  const [newProjectDueDate, setNewProjectDueDate] = useState('');
  const [storageAvailable, setStorageAvailable] = useState(true);

  useEffect(() => {
    try {
      const serializedProjects = JSON.stringify(projects);
      localStorage.setItem(STORAGE_KEY, serializedProjects);

      // Check size after saving
      checkStorageLimit(projects);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      alert(
        'Failed to save your changes. You may have reached the storage limit.'
      );
    }
  }, [projects]);

  useEffect(() => {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      setStorageAvailable(true);
    } catch (e) {
      setStorageAvailable(false);
      console.warn('localStorage is not available. Data will not persist.');
    }
  }, []);

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

  const handleClearAllData = () => {
    if (
      window.confirm(
        'Are you sure you want to delete ALL projects? This cannot be undone.'
      )
    ) {
      setProjects([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(projects, null, 2);
    const dataUri =
      'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = 'project-data.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedData)) {
          setProjects(importedData);
        } else {
          alert('Invalid data format. Import failed.');
        }
      } catch (error) {
        console.error('Error importing data:', error);
        alert('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
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

      {!storageAvailable && (
        <div
          style={{
            padding: '10px',
            backgroundColor: '#fff3cd',
            color: '#856404',
            borderRadius: '4px',
            marginBottom: '20px',
          }}
        >
          <strong>Warning:</strong> Local storage is not available in your
          browser. Your data will not be saved between sessions.
        </div>
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '20px',
          padding: '10px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
        }}
      >
        <h2 style={{ margin: 0 }}>Data Management</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="file"
            id="import-file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={handleImportData}
          />
          <label
            htmlFor="import-file"
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Import
          </label>
          <button
            onClick={handleExportData}
            style={{
              padding: '8px 16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Export
          </button>
          <button
            onClick={handleClearAllData}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Clear All
          </button>
        </div>
      </div>

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
