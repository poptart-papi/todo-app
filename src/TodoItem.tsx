import React, { useState } from 'react';

interface TodoItemProps {
  todo: {
    id: number;
    text: string;
    description: string;
    dueDate: string;
    completed: boolean;
  };
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (
    id: number,
    text: string,
    description: string,
    dueDate: string
  ) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editDescription, setEditDescription] = useState(todo.description);
  const [editDueDate, setEditDueDate] = useState(todo.dueDate);

  const handleEdit = () => {
    onEdit(todo.id, editText, editDescription, editDueDate);
    setIsEditing(false);
  };

  return (
    <li>
      {isEditing ? (
        <>
          <input
            type="text"
            value={editText}
            onChange={e => setEditText(e.target.value)}
            placeholder="Title"
          />
          <input
            type="text"
            value={editDescription}
            onChange={e => setEditDescription(e.target.value)}
            placeholder="Description"
          />
          <input
            type="date"
            value={editDueDate}
            onChange={e => setEditDueDate(e.target.value)}
          />
          <button onClick={handleEdit}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <span
            style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
            onClick={() => onToggle(todo.id)}
          >
            {todo.text}
          </span>
          <p>{todo.description}</p>
          <p>Due: {todo.dueDate}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={() => onDelete(todo.id)}>Delete</button>
        </>
      )}
    </li>
  );
};

export default TodoItem;
