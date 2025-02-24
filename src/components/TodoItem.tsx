import React, { useState } from 'react';
import { TodoItem as TodoItemType, Priority } from '../types';

interface TodoItemProps {
  item: TodoItemType;
  onToggle: (id: number) => void;
  onUpdatePriority: (id: number, priority: Priority) => void;
  onDelete: (id: number) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ 
  item, 
  onToggle, 
  onUpdatePriority,
  onDelete 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.text);

  const handleSaveEdit = () => {
    if (editText.trim()) {
      item.text = editText;
    }
    setIsEditing(false);
  };

  const priorityColors = {
    high: '#dc3545',
    medium: '#ffc107',
    low: '#28a745'
  };

  return (
    <div className="todo-item" style={{ 
      margin: '8px 0', 
      padding: '8px', 
      border: '1px solid #ddd', 
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }}>
      <input
        type="checkbox"
        checked={item.completed}
        onChange={() => onToggle(item.id)}
        style={{ marginRight: '8px' }}
      />
      
      {isEditing ? (
        <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            style={{ flex: 1, padding: '4px' }}
          />
          <button
            onClick={handleSaveEdit}
            style={{
              padding: '4px 8px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Save
          </button>
        </div>
      ) : (
        <>
          <span style={{ 
            textDecoration: item.completed ? 'line-through' : 'none',
            flex: 1
          }}>
            {item.text}
          </span>
          
          <select
            value={item.priority}
            onChange={(e) => onUpdatePriority(item.id, e.target.value as Priority)}
            style={{ 
              padding: '4px',
              backgroundColor: priorityColors[item.priority],
              color: item.priority === 'medium' ? '#000' : '#fff',
              border: 'none',
              borderRadius: '4px'
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
              cursor: 'pointer'
            }}
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(item.id)}
            style={{
              padding: '4px 8px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Delete
          </button>
        </>
      )}
    </div>
  );
};
