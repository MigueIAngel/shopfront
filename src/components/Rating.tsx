export function Rating({ value }: { value: number }) {
  const rounded = Math.round(value * 2) / 2
  return (
    <span className="inline-flex items-center gap-1 text-xs text-stone-500" aria-label={`${value.toFixed(1)} / 5`}>
      <span className="text-amber-500" aria-hidden>
        {'★'.repeat(Math.floor(rounded))}
        {rounded % 1 ? '⯪' : ''}
        <span className="text-stone-300">{'★'.repeat(5 - Math.ceil(rounded))}</span>
      </span>
      {value.toFixed(1)}
    </span>
  )
}
