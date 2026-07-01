interface ProgressBarProps {
  percent: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  color?: string
}

export function ProgressBar({
  percent,
  size = 'md',
  showLabel = true,
  color = 'bg-brand-500',
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent))
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' }

  return (
    <div className="w-full">
      {showLabel && (
        <div className="mb-1 flex justify-between text-xs text-slate-500">
          <span>Progression</span>
          <span className="font-semibold text-slate-700">{clamped}%</span>
        </div>
      )}
      <div className={`w-full overflow-hidden rounded-full bg-slate-200 ${heights[size]}`}>
        <div
          className={`${heights[size]} rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}
