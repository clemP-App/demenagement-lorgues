import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { SearchBar } from '@/components/SearchBar'
import { ItemCard } from '@/components/ItemCard'
import { ItemDetailModal } from '@/components/ItemDetailModal'
import { FilterChips } from '@/components/SearchBar'
import { filterItems } from '@/lib/utils'
import { MODULE_LABELS } from '@/lib/constants'
import type { Item } from '@/types'

const moduleFilters = Object.entries(MODULE_LABELS).map(([value, label]) => ({
  key: value, label, value,
}))

import { PageShell } from '@/components/PageShell'

export function SearchPage() {
  const { items } = useApp()
  const [search, setSearch] = useState('')
  const [module, setModule] = useState('')
  const [selected, setSelected] = useState<Item | null>(null)

  const results = filterItems(items, { search, module: module || undefined })

  return (
    <PageShell size="md">
      <h1 className="text-2xl font-bold text-slate-800">Recherche globale</h1>
      <p className="mt-1 text-sm text-slate-500">
        Cherchez par mot-clé : ENGIE, Julie, garage, voiture, notaire…
      </p>

      <div className="mt-6 space-y-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Rechercher dans tous les modules…" />
        <FilterChips
          filters={[{ key: 'all', label: 'Tous', value: '' }, ...moduleFilters]}
          active={module}
          onChange={setModule}
        />
      </div>

      <p className="mt-4 text-sm text-slate-500">{results.length} résultat(s)</p>

      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
        {results.map((item) => (
          <ItemCard key={item.id} item={item} showModule onClick={() => setSelected(item)} />
        ))}
      </div>

      <ItemDetailModal item={selected} onClose={() => setSelected(null)} />
    </PageShell>
  )
}
