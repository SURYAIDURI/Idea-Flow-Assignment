import React, { useState, useEffect } from 'react';
import './TodoList.css'; 
const TodoList = () => {
  const [tasks, setTasks] = useState([{ content: '', icon: "fa-utensils", linkedTasks: [] }]);
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLinkTaskIndex, setSelectedLinkTaskIndex] = useState(-1);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardInput);
    return () => {
      window.removeEventListener('keydown', handleKeyboardInput);
    };
  }, []);

  const handleAddTask = () => {
    const newTask = {
      content: inputValue.trim() === '' ? ' ' : inputValue,
      icon: "fa-utensils",
      linkedTasks: []
    };
    setTasks([...tasks, newTask]);
    setInputValue('');
  };

  const handleEditTask = (index, updatedContent) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].content = updatedContent;
    setTasks(updatedTasks);
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  const handleLinkTasks = (sourceIndex, targetIndex) => {
    if (selectedLinkTaskIndex !== -1) {
      const updatedTasks = [...tasks];
      if (!updatedTasks[sourceIndex].linkedTasks.includes(selectedLinkTaskIndex)) {
        updatedTasks[sourceIndex].linkedTasks.push(selectedLinkTaskIndex);
        setTasks(updatedTasks);
      }
      setSelectedLinkTaskIndex(-1);
    }
  };

  const handleKeyboardInput = (e) => {
    if (e.key === 'Enter' && inputValue === '<>') {
      handleLinkTasks(tasks.length - 1, selectedLinkTaskIndex);
    } else if (e.key === 'Backspace' && selectedLinkTaskIndex !== -1) {
      const updatedTasks = [...tasks];
      updatedTasks[selectedLinkTaskIndex].linkedTasks = updatedTasks[selectedLinkTaskIndex].linkedTasks.filter(index => index !== tasks.length - 1);
      setTasks(updatedTasks);
      setSelectedLinkTaskIndex(-1);
    }
  };
  
  const renderTask = (task, index) => (
    <li key={index} className="task">
      <div className="task-content">
        <span className={`fa ${task.icon}`} /> {task.content}
        {task.linkedTasks.map(linkedIndex => (
          <div key={linkedIndex} className="linked-task">
            {tasks[linkedIndex].content}
          </div>
        ))}
      </div>
      <input
        type="text"
        className="task-input"
        value={index === tasks.length - 1 ? inputValue : task.content}
        onChange={(e) => handleEditTask(index, e.target.value)}
        autoFocus={index === tasks.length - 1}
      />
      <select
        value={selectedLinkTaskIndex}
        onChange={(e) => setSelectedLinkTaskIndex(Number(e.target.value))}
      >
        <option value={-1}>{"<>"}</option>
        {tasks.map((task, linkIndex) => (
          <option key={linkIndex} value={linkIndex}>
            {task.content}
          </option>
        ))}
      </select>
      <button
        className="task-button"
        onClick={() => handleLinkTasks(index, selectedLinkTaskIndex)}
        disabled={index === tasks.length - 1 || selectedLinkTaskIndex === -1}
      >
        Link to selected task
      </button>
      <button
        className="task-button"
        onClick={() => handleDeleteTask(index)}
      >
        Delete
      </button>
    </li>
  );

  const filteredTasks = tasks.filter(task =>
    task.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="todo-container">
      <input
        type="text"
        className="task-input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter a task..."
      />
      <button className="task-button" onClick={handleAddTask}>
        <i className="fas fa-plus" /> Add Task
      </button>
      <input
        type="text"
        className="task-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search tasks..."
      />
      <ul>
        {filteredTasks.map((task, index) => renderTask(task, index))}
      </ul>
    </div>
  );
};

export default TodoList;
