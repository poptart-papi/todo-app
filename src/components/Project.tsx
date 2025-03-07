import React, { useState } from 'react';
import {
  Project as ProjectType,
  TodoList as TodoListType,
  Priority,
} from '../types';
import { TodoList } from './TodoList';

interface ProjectProps {
  project: ProjectType;
  onToggleTodo: (todoId: number) => void;
  onDelete: () => void;
  onUpdatePriority: (priority: Priority) => void;
  onAddTodoList: (title: string) => void;
  onUpdateTodoList: (listId: number, updates: Partial<TodoListType>) => void;
  onUpdateDueDate: (dueDate: string | null) => void;
}

export const Project: React.FC<ProjectProps> = ({
  project,
  onToggleTodo,
  onDelete,
  onUpdatePriority,
  onAddTodoList,
  onUpdateTodoList,
}) => {
  const [newListTitle, setNewListTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(project.title);
  const [editDescription, setEditDescription] = useState(project.description);
  const [editDueDate, setEditDueDate] = useState(project.dueDate || '');

  const handleAddTodoList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;
    onAddTodoList(newListTitle);
    setNewListTitle('');
  };

  const handleSaveEdit = () => {
    if (!editTitle.trim()) return;
    project.title = editTitle;
    project.description = editDescription;
    onUpdateDueDate(editDueDate || null);
    setIsEditing(false);
  };

  const formatDueDate = (dateString: string | null) => {
    if (!dateString) return null;

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue = () => {
    if (!project.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(project.dueDate);
    return dueDate < today;
  };

  const priorityColors = {
    high: '#dc3545',
    medium: '#ffc107',
    low: '#28a745',
  };

  return (
    <div
      className="project"
      style={{
        margin: '24px 0',
        padding: '20px',
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        {isEditing ? (
          <div style={{ flex: 1 }}>
            <input
              type="text"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
            />
            <textarea
              value={editDescription}
              onChange={e => setEditDescription(e.target.value)}
              style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            />
            <div style={{ marginBottom: '10px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontWeight: 'bold',
                }}
              >
                Due Date:
              </label>
              <input
                type="date"
                value={editDueDate}
                onChange={e => setEditDueDate(e.target.value)}
                style={{ padding: '8px', width: '100%' }}
              />
            </div>
            <button
              onClick={handleSaveEdit}
              style={{
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                marginTop: '10px',
                cursor: 'pointer',
              }}
            >
              Save
            </button>
          </div>
        ) : (
          <>
            <div>
              <h2>{project.title}</h2>
              <p style={{ color: '#666' }}>{project.description}</p>
              {project.dueDate && (
                <div
                  style={{
                    marginTop: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span style={{ fontWeight: 'bold' }}>Due:</span>
                  <span
                    style={{
                      color: isOverdue() ? '#dc3545' : '#212529',
                      fontWeight: isOverdue() ? 'bold' : 'normal',
                    }}
                  >
                    {formatDueDate(project.dueDate)}
                    {isOverdue() && ' (Overdue)'}
                  </span>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <select
                value={project.priority}
                onChange={e => onUpdatePriority(e.target.value as Priority)}
                style={{
                  padding: '8px',
                  backgroundColor: priorityColors[project.priority],
                  color: project.priority === 'medium' ? '#000' : '#fff',
                  border: 'none',
                  borderRadius: '4px',
                }}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#17a2b8',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Edit
              </button>
              <button
                onClick={onDelete}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>

      <form onSubmit={handleAddTodoList} style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={newListTitle}
            onChange={e => setNewListTitle(e.target.value)}
            placeholder="New Todo List Title"
            style={{ flex: 1, padding: '8px' }}
            required
          />
          <button
            type="submit"
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Add Todo List
          </button>
        </div>
      </form>

      <div className="todo-lists">
        {project.todoLists
          .sort((a, b) => {
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
          })
          .map(todoList => (
            <TodoList
              key={todoList.id}
              list={todoList}
              onToggleTodo={onToggleTodo}
              onUpdateList={updates => onUpdateTodoList(todoList.id, updates)}
            />
          ))}
      </div>
    </div>
  );
};
function onUpdateDueDate(arg0: string | null) {
  throw new Error('Function not implemented.');
}
