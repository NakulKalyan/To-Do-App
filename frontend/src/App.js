import React, { useState, useEffect } from 'react';
import './App.css';

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination">
      <button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-button"
      >
        Previous
      </button>
      {pageNumbers.map(number => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`pagination-button ${currentPage === number ? 'active' : ''}`}
        >
          {number}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-button"
      >
        Next
      </button>
    </div>
  );
};

const App = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [view, setView] = useState('list');
    const [createTask, setCreateTask] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); 

    const toggleCreateTask = () => setCreateTask((prev) => !prev);

    useEffect(() => {
        fetch('http://localhost:5000/tasks')
            .then((response) => response.json())
            .then((data) => setTasks(data))
            .catch((err) => console.error(err));
    }, []);

    // Get current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = tasks.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const addTask = () => {
        if (!newTask.trim()) return;
        fetch('http://localhost:5000/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: newTask }),
        })
            .then((response) => response.json())
            .then((data) => {
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
        }).then(() => {
            setTasks(
                tasks.map((t) =>
                    t._id === task._id ? { ...t, completed: !t.completed } : t
                )
            );
        });
    };

    const deleteTask = (id) => {
        fetch(`http://localhost:5000/tasks/${id}`, {
            method: 'DELETE',
        }).then(() => {
            setTasks(tasks.filter((task) => task._id !== id));
            // Adjust current page if necessary after deletion
            const newTotalPages = Math.ceil((tasks.length - 1) / itemsPerPage);
            if (currentPage > newTotalPages) {
                setCurrentPage(newTotalPages);
            }
        });
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <h1 className="main-title">Task Management System</h1>
                <p className="subtitle"></p>
            </header>

            <main className="main-content">
                {createTask && (
                    <section className="input-section">
                        <h2 className="section-title">Create New Task</h2>
                        <div className="input-group">
                            <input
                                type="text"
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addTask()}
                                placeholder=""
                                className="task-input"
                            />
                            <button onClick={addTask} className="add-button">
                                +
                            </button>
                        </div>
                    </section>
                )}

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
                    <button onClick={toggleCreateTask} className="add-button">
                        {createTask ? 'Cancel' : 'Add Tasks'}
                    </button>
                </section>

                {view === 'list' ? (
                    <section className="list-section">
                        <h2 className="section-title"></h2>
                        <ul className="task-list">
                            {currentItems.map((task) => (
                                <li
                                    key={task._id}
                                    className={`task-item ${task.completed ? 'completed' : ''}`}
                                >
                                    <span
                                        className="task-title"
                                        onClick={() => toggleCompletion(task)}
                                    >
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
                        <Pagination
                            totalItems={tasks.length}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                        />
                    </section>
                ) : (
                    <section className="table-section">
                        <h2 className="section-title"></h2>
                        <div className="table-container">
                            <table className="task-table">
                                <thead>
                                    <tr>
                                        <th>Task NO</th>
                                        <th>Task Name</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((task, index) => (
                                        <tr key={task._id}>
                                            <td>{indexOfFirstItem + index + 1}</td>
                                            <td className="task-name">{task.title}</td>
                                            <td>
                                                <span
                                                    className={`status-badge ${
                                                        task.completed ? 'completed' : 'pending'
                                                    }`}
                                                >
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
                        <Pagination
                            totalItems={tasks.length}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                        />
                    </section>
                )}
            </main>
        </div>
    );
};

export default App;