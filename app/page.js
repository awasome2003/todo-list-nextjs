"use client";
import React, { useState, useEffect } from "react";

const ToDoPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [category, setCategory] = useState("Work");
  const [mainTask, setMainTask] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setMainTask(savedTasks);
  }, []);

  // Save tasks to localStorage whenever mainTask changes
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(mainTask));
  }, [mainTask]);

  const submitHandler = (e) => {
    e.preventDefault();
    const newTask = { title, description, dueDate, priority, category };
    setMainTask([...mainTask, newTask]);
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("Medium");
    setCategory("Work");

    // Task notification
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification("New Task Added!", {
            body: `Task: ${title} added!`,
          });
        }
      });
    }
  };

  const deleteHandler = (i) => {
    const copyTask = [...mainTask];
    copyTask.splice(i, 1);
    setMainTask(copyTask);
  };

  const toggleCompleteTask = (i) => {
    const taskToComplete = mainTask[i];
    setCompletedTasks([...completedTasks, taskToComplete]);
    deleteHandler(i);
  };

  const editTaskHandler = (i) => {
    const taskToEdit = mainTask[i];
    setTitle(taskToEdit.title);
    setDescription(taskToEdit.description);
    setDueDate(taskToEdit.dueDate);
    setPriority(taskToEdit.priority);
    setCategory(taskToEdit.category);
    deleteHandler(i);
  };

  const filteredTasks = mainTask.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderTasks = filteredTasks.length ? (
    filteredTasks.map((task, i) => (
      <li
        key={i}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-4 rounded-lg shadow-lg mb-4 transition-all w-full"
      >
        <div className="flex flex-col w-full sm:w-3/4 mb-4 sm:mb-0">
          <h5 className="text-lg sm:text-2xl font-semibold text-gray-800">
            {task.title}
          </h5>
          <p className="text-sm sm:text-lg text-gray-600">{task.description}</p>
          <p className="text-xs sm:text-sm text-gray-500">
            Due: {task.dueDate} | Priority: {task.priority} | Category:{" "}
            {task.category}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center">
          <button
            onClick={() => toggleCompleteTask(i)}
            className="bg-green-600 text-white px-3 py-2 rounded mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto"
          >
            Complete
          </button>
          <button
            onClick={() => editTaskHandler(i)}
            className="bg-blue-600 text-white px-3 py-2 rounded mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto"
          >
            Edit
          </button>
          <button
            onClick={() => deleteHandler(i)}
            className="bg-red-600 text-white px-3 py-2 rounded w-full sm:w-auto"
          >
            Delete
          </button>
        </div>
      </li>
    ))
  ) : (
    <h2 className="text-center text-xl text-gray-600">No Tasks Found</h2>
  );

  return (
    <div
      className={
        isDarkMode
          ? "bg-gray-900 text-white min-h-screen"
          : "bg-gray-100 text-black min-h-screen"
      }
    >
      <h1 className="bg-black text-white p-4 text-2xl sm:text-3xl font-bold text-center">
        To-Do List
      </h1>

      {/* Dark Mode Toggle */}
      <div className="flex justify-center my-4">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="bg-gray-800 text-white px-4 py-2 rounded"
        >
          {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </button>
      </div>

      <form
        onSubmit={submitHandler}
        className="flex flex-col items-center sm:w-3/4 lg:w-1/2 mx-auto"
      >
        <input
          type="text"
          className="text-base sm:text-xl border-2 border-gray-800 m-2 px-4 py-2 rounded-lg w-full text-black"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          className="text-base sm:text-xl border-2 border-gray-800 m-2 px-4 py-2 rounded-lg w-full text-black"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="date"
          className="text-base sm:text-xl border-2 border-gray-800 m-2 px-4 py-2 rounded-lg w-full text-black"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <select
          className="text-base sm:text-xl border-2 border-gray-800 m-2 px-4 py-2 rounded-lg w-full text-black"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <select
          className="text-base sm:text-xl border-2 border-gray-800 m-2 px-4 py-2 rounded-lg w-full text-black"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Urgent">Urgent</option>
        </select>
        <button className="bg-black text-white px-4 py-2 text-lg sm:text-2xl font-bold rounded-lg my-4 w-full">
          Add Task
        </button>
      </form>

      <input
        type="text"
        className="text-base sm:text-xl border-2 border-gray-800 m-4 px-4 py-2 rounded-lg w-3/4 sm:w-1/2 mx-auto block text-black"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="p-8 w-full sm:w-3/4 lg:w-1/2 mx-auto">
        <ul>{renderTasks}</ul>
      </div>
    </div>
  );
};

export default ToDoPage;
