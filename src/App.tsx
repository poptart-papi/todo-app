import React, { useState } from 'react';
import TodoList from './TodoList.tsx';

const App: React.FC = () => {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build a To-Do app', completed: false },
    { id: 3, text: 'Profit!', completed: false },
  ]);

  const [newTodo, setNewTodo] = useState('');

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newTodo.trim() !== '') {
      const newId = todos.length + 1;
      setTodos([...todos, { id: newId, text: newTodo, completed: false }]);
      setNewTodo('');
    }
  };

  return (
    <div>
      <h1>To-Do List</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          placeholder="Enter a new to-do..."
        />
        <button type="submit">Add</button>
      </form>
      <TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete} />
    </div>
  );
};

export default App;
