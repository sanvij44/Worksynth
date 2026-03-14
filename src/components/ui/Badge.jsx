const variants = {
  done: 'badge-done',
  review: 'badge-review',
  pending: 'badge-pending',
}

const dots = {
  done: '●',
  review: '●',
  pending: '●',
}

export default function Badge({ status = 'pending', label, className = '' }) {
  const statusLabels = {
    done: label || 'Completed',
    review: label || 'In Review',
    pending: label || 'Pending',
  }

  return (
    <span className={`badge ${variants[status]} ${className}`}>
      <span className="text-[8px]">{dots[status]}</span>
      {statusLabels[status]}
    </span>
  )
}
