import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { tasksApi } from '../api';
import TaskColumn from '../components/TaskColumn';
import CreateTaskModal from '../components/CreateTaskModal';

const STATUSES = ['todo', 'in_progress', 'done'];

export default function Board() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      const data = await tasksApi.getAll();
      setTasks(data.tasks);
    } catch (err) {
      setError('Failed to load tasks');
    }
  }

  async function handleCreate(taskData) {
    const data = await tasksApi.create(taskData);
    setTasks((prev) => [...prev, data.task]);
  }

  async function handleMove(id, newStatus) {
    try {
      const data = await tasksApi.update(id, { status: newStatus });
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? data.task : t))
      );
    } catch {
      setError('Failed to update task');
    }
  }

  async function handleDelete(id) {
    try {
      await tasksApi.remove(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch {
      setError('Failed to delete task');
    }
  }

  return (
    <div className="board-page">
      <header className="board-header">
        <h1>TaskForge</h1>
        <div className="header-right">
          <span className="user-name">{user?.name}</span>
          <button className="btn-secondary" onClick={logout}>
            Sign out
          </button>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError('')}>&times;</button>
        </div>
      )}

      <div className="board-toolbar">
        <button onClick={() => setShowModal(true)}>+ New Task</button>
      </div>

      <div className="board-columns">
        {STATUSES.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks}
            onMove={handleMove}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {showModal && (
        <CreateTaskModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}
