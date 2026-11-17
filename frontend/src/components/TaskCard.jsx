const PRIORITY_LABELS = {
  low: { text: 'Low', className: 'priority-low' },
  medium: { text: 'Med', className: 'priority-medium' },
  high: { text: 'High', className: 'priority-high' },
};

export default function TaskCard({ task, onMove, onDelete }) {
  const priority = PRIORITY_LABELS[task.priority] || PRIORITY_LABELS.medium;

  return (
    <div className="task-card">
      <div className="task-header">
        <span className={`priority-badge ${priority.className}`}>
          {priority.text}
        </span>
        <button
          className="btn-icon"
          onClick={() => onDelete(task.id)}
          title="Delete task"
        >
          &times;
        </button>
      </div>

      <h3 className="task-title">{task.title}</h3>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-actions">
        {task.status !== 'todo' && (
          <button
            className="btn-small"
            onClick={() => {
              const prev = task.status === 'done' ? 'in_progress' : 'todo';
              onMove(task.id, prev);
            }}
          >
            ← Back
          </button>
        )}
        {task.status !== 'done' && (
          <button
            className="btn-small"
            onClick={() => {
              const next = task.status === 'todo' ? 'in_progress' : 'done';
              onMove(task.id, next);
            }}
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
