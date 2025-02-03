import React, { useState } from 'react';
import TodoList from './TodoList.tsx';

const App: React.FC = () => {
  const [todos, setTodos] = useState([
    {
      id: 1,
      text: 'Learn React',
      description: 'Learn the basics of React',
      dueDate: '2023-06-30',
      completed: false,
    },
    {
      id: 2,
      text: 'Build a To-Do app',
      description: 'Build a To-Do app with React and Typescript',
      dueDate: '2023-07-15',
      completed: false,
    },
    {
      id: 3,
      text: 'Profit!',
      description: 'Monetize the app',
      dueDate: '2023-08-01',
      completed: false,
    },
  ]);

  const [newTodo, setNewTodo] = useState({
    text: '',
    description: '',
    dueDate: '',
  });

  const handleToggle = (id: number) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDelete = (id: number) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  const handleEdit = (id: number, text: string) => {
    setTodos(prevTodos =>
      prevTodos.map(todo => (todo.id === id ? { ...todo, text } : todo))
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newTodo.trim() !== '') {
      const newId = todos.length + 1;
      setTodos([
        ...todos,
        {
          id: newId,
          text: newTodo,
          description: newTodo.description,
          dueDate: newTodo.dueDate,
          completed: false,
        },
      ]);
      setNewTodo({ text: '', descriptionL: '', dueDate: '' });
    }
  };

  return (
    <div>
      <h1>To-Do List</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newTodo.text}
          onChange={e =>
            setNewTodo({ ...newTodo, description: e.target.value })
          }
          placeholder="Enter a new to-do..."
        />
        <input
          type="text"
          value={newTodo.description}
          onChange={e =>
            setNewTodo({ ...newTodo, description: e.target.value })
          }
          placeholder="Enter a description..."
        />
        <input
          type="date"
          value={newTodo.dueDate}
          onChange={e => setNewTodo({ ...newTodo, dueDate: e.target.value })}
        />
        <button type="submit">Add</button>
      </form>
      <TodoList
        todos={todos}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </div>
  );
};

export default App;
