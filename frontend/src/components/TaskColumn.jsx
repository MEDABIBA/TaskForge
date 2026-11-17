import TaskCard from './TaskCard';

const COLUMN_TITLES = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
};

export default function TaskColumn({ status, tasks, onMove, onDelete }) {
  const filtered = tasks.filter((t) => t.status === status);

  return (
    <div className="task-column">
      <div className="column-header">
        <h2>{COLUMN_TITLES[status]}</h2>
        <span className="task-count">{filtered.length}</span>
      </div>
      <div className="column-body">
        {filtered.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onMove={onMove}
            onDelete={onDelete}
          />
        ))}
        {filtered.length === 0 && (
          <p className="empty-column">No tasks</p>
        )}
      </div>
    </div>
  );
}
