import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [view, setView] = useState('list');

    useEffect(() => {
        fetch('http://localhost:5000/tasks')
            .then(response => response.json())
            .then(data => setTasks(data))
            .catch(err => console.error(err));
    }, []);

    const addTask = () => {
        if (!newTask.trim()) return;
        fetch('http://localhost:5000/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: newTask }),
        })
            .then(response => response.json())
            .then(data => {
                setTasks([...tasks, data]);
                setNewTask('');
            });
    };

    const toggleCompletion = (task) => {
        fetch(`http://localhost:5000/tasks/${task._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed: !task.completed }),
        })
            .then(() => {
                setTasks(tasks.map(t =>
                    t._id === task._id ? { ...t, completed: !t.completed } : t
                ));
            });
    };

    const deleteTask = (id) => {
        fetch(`http://localhost:5000/tasks/${id}`, {
            method: 'DELETE',
        })
            .then(() => {
                setTasks(tasks.filter(task => task._id !== id));
            });
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <h1 className="main-title">Task Management System</h1>
                <p className="subtitle">Organize your tasks efficiently</p>
            </header>

            <main className="main-content">
                <section className="input-section">
                    <h2 className="section-title">Create New Task</h2>
                    <div className="input-group">
                        <input
                            type="text"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addTask()}
                            placeholder="What needs to be done?"
                            className="task-input"
                        />
                        <button onClick={addTask} className="add-button">
                            Add Task
                        </button>
                    </div>
                </section>

                <section className="view-toggle-section">
                    <button
                        onClick={() => setView('list')}
                        className={`view-button ${view === 'list' ? 'active' : ''}`}
                    >
                        List View
                    </button>
                    <button
                        onClick={() => setView('table')}
                        className={`view-button ${view === 'table' ? 'active' : ''}`}
                    >
                        Table View
                    </button>
                </section>

                {view === 'list' ? (
                    <section className="list-section">
                        <h2 className="section-title">Quick Task List</h2>
                        <h3 className="section-subtitle">Your day-to-day task overview</h3>
                        <ul className="task-list">
                            {tasks.map((task) => (
                                <li key={task._id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                                    <span className="task-title" onClick={() => toggleCompletion(task)}>
                                        {task.title}
                                    </span>
                                    <div className="task-actions">
                                        <button
                                            onClick={() => toggleCompletion(task)}
                                            className="action-button complete-button"
                                        >
                                            {task.completed ? 'Undo' : 'Complete'}
                                        </button>
                                        <button
                                            onClick={() => deleteTask(task._id)}
                                            className="action-button delete-button"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                ) : (
                    <section className="table-section">
                        <h2 className="section-title">Detailed Task Table</h2>
                        <h3 className="section-subtitle">Comprehensive view of your tasks</h3>
                        <div className="table-container">
                            <table className="task-table">
                                <thead>
                                    <tr>
                                        <th>Task ID</th>
                                        <th>Task Name</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.map((task, index) => (
                                        <tr key={task._id}>
                                            <td>{index + 1}</td>
                                            <td className="task-name">{task.title}</td>
                                            <td>
                                                <span className={`status-badge ${task.completed ? 'completed' : 'pending'}`}>
                                                    {task.completed ? 'Completed' : 'Pending'}
                                                </span>
                                            </td>
                                            <td className="table-actions">
                                                <button
                                                    onClick={() => toggleCompletion(task)}
                                                    className="action-button complete-button"
                                                >
                                                    {task.completed ? 'Undo' : 'Complete'}
                                                </button>
                                                <button
                                                    onClick={() => deleteTask(task._id)}
                                                    className="action-button delete-button"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

export default App;