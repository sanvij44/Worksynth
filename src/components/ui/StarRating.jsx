export default function StarRating({ rating = 5, size = 'sm' }) {
  const sizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' }
  return (
    <div className={`flex gap-0.5 ${sizes[size]}`}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={i <= rating ? 'text-amber-400' : 'text-slate-600'}>★</span>
      ))}
    </div>
  )
}
