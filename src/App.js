import React, { useState, useEffect, useReducer } from "react";
import "./App.css"; 

const taskReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TASK":
      return [...state, action.payload];
    case "UPDATE_TASK":
      return state.map((task, index) =>
        index === action.payload.index ? action.payload.newTask : task
      );
    case "DELETE_TASK":
      return state.filter((_, index) => index !== action.payload);
    case "LOAD_TASKS":
      return action.payload;
    default:
      return state;
  }
};

const App = () => {
  const [tasks, dispatch] = useReducer(taskReducer, []);
  const [task, setTask] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    dispatch({ type: "LOAD_TASKS", payload: savedTasks });
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddOrUpdate = () => {
    if (!task.trim()) return; 

    if (isEditing) {
      dispatch({
        type: "UPDATE_TASK",
        payload: { index: editIndex, newTask: task },
      });
      setIsEditing(false);
    } else {
      dispatch({ type: "ADD_TASK", payload: task });
    }

    setTask("");
    setEditIndex(null);
  };

  const handleDelete = (index) => {
    dispatch({ type: "DELETE_TASK", payload: index });
  };

  const handleEdit = (index) => {
    setTask(tasks[index]);
    setIsEditing(true);
    setEditIndex(index);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setTask("");
    setEditIndex(null);
  };

  return (
    <div className="todo-container">
      <h1>To-Do List</h1>

      <div className="input-section">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter a task"
          className="todo-input"
        />
        <button onClick={handleAddOrUpdate} className="todo-button">
          {isEditing ? "Update" : "Add"}
        </button>
        {isEditing && (
          <button onClick={handleCancelEdit} className="todo-cancel-button">
            Cancel
          </button>
        )}
      </div>

      <ul className="todo-list">
        {tasks.map((item, index) => (
          <li key={index} className="todo-item">
            <span>{item}</span>
            <div className="todo-actions">
              <button onClick={() => handleEdit(index)} className="edit-button">
                Edit
              </button>
              <button
                onClick={() => handleDelete(index)}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
