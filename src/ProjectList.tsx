import React, { useState } from 'react';
import TodoList from './TodoList.tsx';

interface TodoListType {
  id: number;
  title: string;
}

interface Project {
  id: number;
  title: string;
  todoLists: TodoListType[];
}

interface ProjectListProps {}

const ProjectList: React.FC<ProjectListProps> = props => {
  const [projects, setProjects] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleAddProject = () => {
    if (inputValue.trim() !== '') {
      const newProject: Project = {
        id: Date.now(),
        title: inputValue,
        todoLists: [],
      };
      setProjects([...projects, newProject]);
      setInputValue('');
    }
  };

  const handleEditProject = (projectId: number) => {
    setEditingProjectId(projectId);
    const projectToEdit = projects.find(project => project.id === projectId);
    if (projectToEdit) {
      setInputValue(projectToEdit.title);
    }
  };

  const handleUpdateProject = () => {
    if (inputValue.trim() !== '' && editingProjectId !== null) {
      const updatedProjects = projects.map(project => {
        if (project.id === editingProjectId) {
          return { ...project, title: inputValue };
        }
        return project;
      });
      setProjects(updatedProjects);
      setEditingProjectId(null);
      setInputValue('');
    }
  };

  const handleDeleteProject = (projectId: number) => {
    const updatedProjects = projects.filter(
      project => project.id !== projectId
    );
    setProjects(updatedProjects);
  };

  const handleAddTodoList = (projectId: number) => {
    const newTodoList: TodoListType = {
      id: Date.now(),
      title: 'New Todo-List',
    };
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        return { ...project, todoLists: [...project.todoLists, newTodoList] };
      }
      return project;
    });
    setProjects(updatedProjects);
  };

  const handleEditTodoList = (
    projectId: number,
    todoListId: number,
    newTitle: string
  ) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        const updatedTodoLists = project.todoLists.map(todoList => {
          if (todoList.id === todoListId) {
            return { ...todoList, title: newTitle };
          }
          return todoList;
        });
        return { ...project, todoLists: updatedTodoLists };
      }
      return project;
    });
    setProjects(updatedProjects);
  };

  const handleDeleteTodoList = (projectId: number, todoListId: number) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        const updatedTodoLists = project.todoLists.filter(
          todoList => todoList.id !== todoListId
        );
        return { ...project, todoLists: updatedTodoLists };
      }
      return project;
    });
    setProjects(updatedProjects);
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={editingProjectId ? 'Edit project' : 'Enter a project'}
      />
      {editingProjectId ? (
        <button onClick={handleUpdateProject}>Save</button>
      ) : (
        <button onClick={handleAddProject}>Add Project</button>
      )}
      <ul>
        {projects.map(project => (
          <li key={project.id}>
            <h3>{project.title}</h3>
            <button onClick={() => handleEditProject(project.id)}>
              Edit Project
            </button>
            <button onClick={() => handleDeleteProject(project.id)}>
              Delete Project
            </button>
            <ul>
              {project.todoLists.map(todoList => (
                <li key={todoList.id}>
                  {todoList.title}
                  <button
                    onClick={() => {
                      const newTitle = prompt(
                        'Enter new title',
                        todoList.title
                      );
                      if (newTitle !== null) {
                        handleEditTodoList(project.id, todoList.id, newTitle);
                      }
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteTodoList(project.id, todoList.id)
                    }
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
            <button onClick={() => handleAddTodoList(project.id)}>
              Add TodoList
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;
