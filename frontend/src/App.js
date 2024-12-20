import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';


const AddTaskModal = ({ isOpen, onClose, onAdd }) => {
    const [taskTitle, setTaskTitle] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (taskTitle.trim()) {
            onAdd(taskTitle);
            setTaskTitle('');
            onClose();
        } else {
            toast.warning('Please enter a task title!');
        }
    };

    
    const modalStyles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
        },
        content: {
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
        },
        headerTitle: {
            margin: 0,
            fontSize: '1.5rem',
        },
        closeButton: {
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: 0,
            color: '#666',
        },
        body: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '20px',
        },
        input: {
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '1rem',
            marginRight: '5px'
        },
        submitButton: {
            padding: '8px 16px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            backgroundColor: '#007bff',
            color: 'white',
        },
    };

    return (
        <div style={modalStyles.overlay} onClick={onClose}>
            <div style={modalStyles.content} onClick={e => e.stopPropagation()}>
                <div style={modalStyles.header}>
                    <h2 style={modalStyles.headerTitle}>Add New Task</h2>
                    <button style={modalStyles.closeButton} onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div style={modalStyles.body}>
                        <input
                            type="text"
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                            placeholder="Enter task"
                            style={modalStyles.input}
                            autoFocus
                        />
                        <button 
                            type="submit" 
                            style={modalStyles.submitButton}
                        >
                            +
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, taskTitle }) => {
    if (!isOpen) return null;

    const modalStyles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
        },
        content: {
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '400px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        },
        header: {
            textAlign: 'center',
            marginBottom: '20px',
        },
        title: {
            margin: '0 0 10px 0',
            color: '#dc3545',
        },
        message: {
            marginBottom: '20px',
            textAlign: 'center',
            color: '#666',
        },
        buttons: {
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
        },
        cancelButton: {
            padding: '8px 16px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            backgroundColor: '#fff',
            cursor: 'pointer',
        },
        confirmButton: {
            padding: '8px 16px',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: '#dc3545',
            color: 'white',
            cursor: 'pointer',
        },
    };

    return (
        <div style={modalStyles.overlay} onClick={onClose}>
            <div style={modalStyles.content} onClick={e => e.stopPropagation()}>
                <div style={modalStyles.header}>
                    <h2 style={modalStyles.title}>Delete Task</h2>
                    <p style={modalStyles.message}>
                        Are you sure you want to delete the task "{taskTitle}"?
                    </p>
                </div>
                <div style={modalStyles.buttons}>
                    <button style={modalStyles.cancelButton} onClick={onClose}>
                        Cancel
                    </button>
                    <button 
                        style={modalStyles.confirmButton} 
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};  

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
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, taskId: null, taskTitle: '' });
    const [tasks, setTasks] = useState([]);
    const [view, setView] = useState('list');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetch('http://localhost:5000/tasks')
            .then((response) => response.json())
            .then((data) => setTasks(data))
            .catch((err) => {
                console.error(err);
                toast.error('Failed to load tasks');
            });
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = tasks.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const addTask = (taskTitle) => {
        fetch('http://localhost:5000/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: taskTitle }),
        })
            .then((response) => response.json())
            .then((data) => {
                setTasks([...tasks, data]);
                toast.success('Task added successfully!',{
                    autoClose: 1000
                });
            })
            .catch((error) => {
                console.error('Error:', error);
                toast.error('Failed to add task',{
                    autoClose: 1000
                });
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
            setTasks(
                tasks.map((t) =>
                    t._id === task._id ? { ...t, completed: !t.completed } : t
                )
            );
            toast.success(`Task ${task.completed ? 'uncompleted' : 'completed'}!`,{
                autoClose: 1000
            });
        })
        .catch(() => {
            toast.error('Failed to update task',{
                autoClose: 1000
            });
        });
    };

    const handleDeleteClick = (task) => {
        setDeleteModal({ 
            isOpen: true, 
            taskId: task._id,
            taskTitle: task.title
        });
    };

    const deleteTask = (id) => {
        fetch(`http://localhost:5000/tasks/${id}`, {
            method: 'DELETE',
        })
        .then(() => {
            setTasks(tasks.filter((task) => task._id !== id));
            const newTotalPages = Math.ceil((tasks.length - 1) / itemsPerPage);
            if (currentPage > newTotalPages) {
                setCurrentPage(newTotalPages);
            }
            toast.success('Task deleted successfully!', {
                autoClose: 1000
            });
        })
        .catch(() => {
            toast.error('Failed to delete task', {
                autoClose: 1000
            });
        });
    };

    return (
        <div className="app-container">
            <ToastContainer />
            <AddTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={addTask}
            />
            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, taskId: null, taskTitle: '' })}
                onConfirm={() => deleteTask(deleteModal.taskId)}
                taskTitle={deleteModal.taskTitle}
            />
            
            <header className="app-header">
                <h1 className="main-title">Task Management System</h1>
            </header>

            <main className="main-content">
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
                    <button onClick={() => setIsModalOpen(true)} className="add-button">
                        Add Task
                    </button>
                </section>

                {/* Rest of your component remains the same */}
                {view === 'list' ? (
                    <section className="list-section">
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
                                            onClick={() => handleDeleteClick(task)}
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
                        <div className="table-container">
                            <table className="task-table">
                                <thead>
                                    <tr>
                                        <th style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 2, borderBottom: '2px solid #ccc', padding:'8px' }}>Task NO</th>
                                        <th style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 2, borderBottom: '2px solid #ccc', padding:'8px' }}>Task Name</th>
                                        <th style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 2, borderBottom: '2px solid #ccc', padding:'8px' }}>Status</th>
                                        <th style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 2, borderBottom: '2px solid #ccc', padding:'8px' }}>Actions</th>
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
                                                    onClick={() => handleDeleteClick(task)}
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