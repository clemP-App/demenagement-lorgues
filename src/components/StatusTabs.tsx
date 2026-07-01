interface StatusTabsProps {
  pending: number
  done: number
  value: 'pending' | 'done'
  onChange: (v: 'pending' | 'done') => void
}

export function StatusTabs({ pending, done, value, onChange }: StatusTabsProps) {
  return (
    <div className="flex rounded-xl bg-slate-100/80 p-1 ring-1 ring-slate-200/60">
      <button
        type="button"
        onClick={() => onChange('pending')}
        className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${
          value === 'pending'
            ? 'bg-white text-brand-700 shadow-sm ring-1 ring-slate-200/80'
            : 'text-slate-500'
        }`}
      >
        À faire
        {pending > 0 && (
          <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-bold text-brand-700">
            {pending}
          </span>
        )}
      </button>
      <button
        type="button"
        onClick={() => onChange('done')}
        className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${
          value === 'done'
            ? 'bg-white text-green-700 shadow-sm ring-1 ring-slate-200/80'
            : 'text-slate-500'
        }`}
      >
        Fait
        {done > 0 && (
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">
            {done}
          </span>
        )}
      </button>
    </div>
  )
}
