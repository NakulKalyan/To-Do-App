import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/tasks')
            .then(response => setTasks(response.data))
            .catch(err => console.error(err));
    }, []);

    const addTask = () => {
        if (!newTask.trim()) return;
        axios.post('http://localhost:5000/tasks', { title: newTask })
            .then(response => {
                setTasks([...tasks, response.data]);
                setNewTask('');
            });
    };

    const toggleCompletion = (task) => {
        axios.put(`http://localhost:5000/tasks/${task._id}`, { completed: !task.completed })
            .then(() => {
                setTasks(tasks.map(t =>
                    t._id === task._id ? { ...t, completed: !t.completed } : t
                ));
            });
    };

    const deleteTask = (id) => {
        axios.delete(`http://localhost:5000/tasks/${id}`)
            .then(() => {
                setTasks(tasks.filter(task => task._id !== id));
            });
    };

    return (
        <div className="App">
            <h1>To-Do App</h1>
            <div>
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add a new task"
                />
                <button onClick={addTask}>Add</button>
            </div>
            <ul>
                {tasks.map(task => (
                    <li key={task._id}>
                        <span onClick={() => toggleCompletion(task)}>
                            {task.completed ? <s>{task.title}</s> : task.title}
                        </span>
                        <button onClick={() => deleteTask(task._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
