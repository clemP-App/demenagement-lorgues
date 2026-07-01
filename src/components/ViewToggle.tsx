import { List, CalendarDays, LayoutGrid } from 'lucide-react'

export type ListViewMode = 'period' | 'calendar' | 'category'

const MODES: { id: ListViewMode; label: string; icon: typeof List }[] = [
  { id: 'period', label: 'Périodes', icon: LayoutGrid },
  { id: 'calendar', label: 'Calendrier', icon: CalendarDays },
  { id: 'category', label: 'Catégories', icon: List },
]

interface ViewToggleProps {
  value: ListViewMode
  onChange: (mode: ListViewMode) => void
}

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="flex rounded-xl bg-slate-100/80 p-1 ring-1 ring-slate-200/60">
      {MODES.map(({ id, label, icon: Icon }) => {
        const active = value === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold transition-all sm:px-3 sm:text-sm ${
              active
                ? 'bg-white text-brand-700 shadow-sm ring-1 ring-slate-200/80'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="hidden xs:inline sm:inline">{label}</span>
          </button>
        )
      })}
    </div>
  )
}
