import React, { useState } from 'react';
import {
  TodoList as TodoListType,
  TodoItem as TodoItemType,
  Priority,
} from '../types';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  list: TodoListType;
  onToggleTodo: (todoId: number) => void;
  onUpdateList: (updates: Partial<TodoListType>) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  list,
  onToggleTodo,
  onUpdateList,
}) => {
  const [newTodoText, setNewTodoText] = useState('');
  const [newTodoDetails, setNewTodoDetails] = useState('');
  const [newTodoPriority, setNewTodoPriority] = useState<Priority>('medium');
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(list.title);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    const newTodo: TodoItemType = {
      id: Math.max(...list.todos.map(todo => todo.id), 0) + 1,
      text: newTodoText,
      details: newTodoDetails,
      completed: false,
      priority: newTodoPriority,
    };

    onUpdateList({
      ...list,
      todos: [...list.todos, newTodo],
    });

    setNewTodoText('');
    setNewTodoDetails('');
    setNewTodoPriority('medium');
  };

  const handleSaveEdit = () => {
    if (!editTitle.trim()) return;
    onUpdateList({
      ...list,
      title: editTitle,
    });
    setIsEditing(false);
  };

  const handleUpdateTodoPriority = (todoId: number, priority: Priority) => {
    onUpdateList({
      ...list,
      todos: list.todos.map(todo =>
        todo.id === todoId ? { ...todo, priority } : todo
      ),
    });
  };

  const handleDeleteTodo = (todoId: number) => {
    onUpdateList({
      ...list,
      todos: list.todos.filter(todo => todo.id !== todoId),
    });
  };

  const handleUpdateListPriority = (priority: Priority) => {
    onUpdateList({
      ...list,
      priority,
    });
  };

  const priorityColors = {
    high: '#dc3545',
    medium: '#ffc107',
    low: '#28a745',
  };

  return (
    <div
      className="todo-list"
      style={{
        margin: '16px 0',
        padding: '16px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        {isEditing ? (
          <div style={{ display: 'flex', gap: '10px', flex: 1 }}>
            <input
              type="text"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              style={{ flex: 1, padding: '8px' }}
            />
            <button
              onClick={handleSaveEdit}
              style={{
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Save
            </button>
          </div>
        ) : (
          <>
            <h3 style={{ margin: 0 }}>{list.title}</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <select
                value={list.priority}
                onChange={e =>
                  handleUpdateListPriority(e.target.value as Priority)
                }
                style={{
                  padding: '4px',
                  backgroundColor: priorityColors[list.priority],
                  color: list.priority === 'medium' ? '#000' : '#fff',
                  border: 'none',
                  borderRadius: '4px',
                }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  padding: '4px 8px',
                  backgroundColor: '#17a2b8',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Edit Title
              </button>
            </div>
          </>
        )}
      </div>

      <form onSubmit={handleAddTodo} style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={newTodoText}
              onChange={e => setNewTodoText(e.target.value)}
              placeholder="What's next?..."
              style={{ flex: 1, padding: '8px' }}
              required
            />

            <select
              value={newTodoPriority}
              onChange={e => setNewTodoPriority(e.target.value as Priority)}
              style={{ padding: '8px' }}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <textarea
            value={newTodoDetails}
            onChange={e => setNewTodoDetails(e.target.value)}
            placeholder="Add details (optional)"
            style={{ width: '100%', padding: '8px', minHeight: '60px' }}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
              Let's do it
            </button>
          </div>
        </div>
      </form>

      <div>
        {list.todos
          .sort((a, b) => {
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
          })
          .map(todo => (
            <TodoItem
              key={todo.id}
              item={todo}
              onToggle={onToggleTodo}
              onUpdatePriority={handleUpdateTodoPriority}
              onDelete={handleDeleteTodo}
            />
          ))}
      </div>
    </div>
  );
};
