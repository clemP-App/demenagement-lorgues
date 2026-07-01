import { ModulePage } from '@/components/ModulePage'
import { CONTACT_CATEGORIES } from '@/lib/constants'

const quickFilters = CONTACT_CATEGORIES.map((c) => ({
  key: c, label: c, value: c,
}))

export function ContactsPage() {
  return (
    <ModulePage
      module="contacts"
      title="Contacts utiles"
      subtitle="Déménageur, agence, école, assurances…"
      quickFilters={quickFilters}
      defaultStatus="a_contacter"
    />
  )
}
