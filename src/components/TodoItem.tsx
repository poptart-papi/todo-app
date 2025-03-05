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
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.text);
  const [editDetails, setEditDetails] = useState(item.details || '');
  const [showDetails, setShowDetails] = useState(false);

  const handleSaveEdit = () => {
    if (editText.trim()) {
      item.text = editText;
      item.details = editDetails;
    }
    setIsEditing(false);
  };

  const priorityColors = {
    high: '#dc3545',
    medium: '#ffc107',
    low: '#28a745',
  };

  return (
    <div
      className="todo-item"
      style={{
        margin: '8px 0',
        padding: '8px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        backgroundColor: 'white',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <input
          type="checkbox"
          checked={item.completed}
          onChange={() => onToggle(item.id)}
          style={{ marginRight: '8px' }}
        />

        {isEditing ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              flex: 1,
            }}
          >
            <input
              type="text"
              value={editText}
              onChange={e => setEditText(e.target.value)}
              style={{ flex: 1, padding: '4px' }}
              placeholder="Task title"
            />
            <textarea
              value={editDetails}
              onChange={e => setEditDetails(e.target.value)}
              style={{ width: '100%', padding: '4px', minHeight: '60px' }}
              placeholder="Task details (optional)"
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={handleSaveEdit}
                style={{
                  padding: '4px 8px',
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
          </div>
        ) : (
          <>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span
                  style={{
                    textDecoration: item.completed ? 'line-through' : 'none',
                    fontWeight: 'bold',
                  }}
                >
                  {item.text}
                </span>
                {item.details && (
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0 4px',
                      fontSize: '16px',
                      color: '#6c757d',
                    }}
                  >
                    {showDetails ? '▼' : '►'}
                  </button>
                )}
              </div>
              {showDetails && item.details && (
                <div
                  style={{
                    margin: '8px 0 8px 24px',
                    padding: '8px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px',
                    fontSize: '0.9em',
                  }}
                >
                  {item.details}
                </div>
              )}
            </div>

            <select
              value={item.priority}
              onChange={e =>
                onUpdatePriority(item.id, e.target.value as Priority)
              }
              style={{
                padding: '4px',
                backgroundColor: priorityColors[item.priority],
                color: item.priority === 'medium' ? '#000' : '#fff',
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
                cursor: 'pointer',
              }}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};
