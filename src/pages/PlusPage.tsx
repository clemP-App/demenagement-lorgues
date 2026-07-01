import { Link } from 'react-router-dom'
import {
  FileText, FolderOpen, Users, CheckSquare, Wallet, Activity, Settings, Search,
} from 'lucide-react'

const links = [
  { to: '/demarches', icon: FileText, label: 'Démarches' },
  { to: '/documents', icon: FolderOpen, label: 'Documents' },
  { to: '/contacts', icon: Users, label: 'Contacts' },
  { to: '/verifications', icon: CheckSquare, label: 'Vérifications' },
  { to: '/budget', icon: Wallet, label: 'Budget' },
  { to: '/activite', icon: Activity, label: 'Activité' },
  { to: '/recherche', icon: Search, label: 'Recherche globale' },
  { to: '/parametres', icon: Settings, label: 'Paramètres' },
]

export function PlusPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <h1 className="text-2xl font-bold text-slate-800">Plus</h1>
      <p className="mt-1 text-sm text-slate-500">Autres sections et outils</p>
      <div className="mt-6 grid gap-3">
        {links.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 hover:shadow-sm"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
              <Icon className="h-5 w-5 text-slate-600" />
            </div>
            <span className="font-medium text-slate-800">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
