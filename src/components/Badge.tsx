import { STATUS_LABELS, STATUS_COLORS, PRIORITY_LABELS, PRIORITY_COLORS } from '@/lib/constants'

interface BadgeProps {
  label: string
  colorClass: string
  small?: boolean
}

function Badge({ label, colorClass, small }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${colorClass} ${
        small ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      }`}
    >
      {label}
    </span>
  )
}

export function StatusBadge({ status, small }: { status: string; small?: boolean }) {
  return (
    <Badge
      label={STATUS_LABELS[status] ?? status}
      colorClass={STATUS_COLORS[status] ?? 'bg-slate-100 text-slate-700'}
      small={small}
    />
  )
}

export function PriorityBadge({ priority, small }: { priority: string; small?: boolean }) {
  return (
    <Badge
      label={PRIORITY_LABELS[priority] ?? priority}
      colorClass={PRIORITY_COLORS[priority] ?? 'bg-slate-100 text-slate-600'}
      small={small}
    />
  )
}
