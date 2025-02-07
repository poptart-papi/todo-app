import React, { useState } from 'react';

interface TodoItem {
  id: number;
  text: string;
}

interface TodoListProps {
  projectId: number;
}

const TodoList: React.FC<TodoListProps> = ({ projectId }) => {
  const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleAddTodoItem = () => {
    if (inputValue.trim() !== '') {
      const newTodoItem: TodoItem = {
        id: Date.now(),
        text: inputValue,
      };
      setTodoItems([...todoItems, newTodoItem]);
      setInputValue('');
    }
  };

  const handleRemoveTodoItem = (itemId: number) => {
    const updatedTodoItems = todoItems.filter(item => item.id !== itemId);
    setTodoItems(updatedTodoItems);
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="What's next?"
      />
      <button onClick={() => handleAddTodoItem}>Let's do it</button>
      <ul>
        {todoItems.map(item => {
          <li key={item.id}>
            {item.text}
            <button onClick={() => handleRemoveTodoItem(item.id)}>
              Remove
            </button>
          </li>;
        })}
      </ul>
    </div>
  );
};

export default TodoList;
