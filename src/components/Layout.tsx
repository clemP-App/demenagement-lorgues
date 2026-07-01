import { Link, useLocation } from 'react-router-dom'
import {
  Home, Calendar, FileText, Package, Car, FolderOpen,
  Users, CheckSquare, Wallet, Activity, Settings, MoreHorizontal,
  RefreshCw,
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { OfflineBanner } from '@/components/OfflineBanner'
import { InstallPrompt } from '@/components/InstallPrompt'

const desktopNav = [
  { to: '/', icon: Home, label: 'Tableau de bord' },
  { to: '/echeancier', icon: Calendar, label: 'Échéancier' },
  { to: '/demarches', icon: FileText, label: 'Démarches' },
  { to: '/cartons', icon: Package, label: 'Cartons' },
  { to: '/voitures', icon: Car, label: 'Voitures' },
  { to: '/documents', icon: FolderOpen, label: 'Documents' },
  { to: '/contacts', icon: Users, label: 'Contacts' },
  { to: '/verifications', icon: CheckSquare, label: 'Vérifications' },
  { to: '/budget', icon: Wallet, label: 'Budget' },
  { to: '/activite', icon: Activity, label: 'Activité' },
  { to: '/parametres', icon: Settings, label: 'Paramètres' },
]

const mobileNav = [
  { to: '/', icon: Home, label: 'Accueil' },
  { to: '/echeancier', icon: Calendar, label: 'Tâches' },
  { to: '/cartons', icon: Package, label: 'Cartons' },
  { to: '/voitures', icon: Car, label: 'Voitures' },
  { to: '/plus', icon: MoreHorizontal, label: 'Plus' },
]

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const { online, syncItems, itemsSyncing, workspace } = useApp()

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar desktop */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="border-b border-slate-100 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-lg">📦</div>
            <div>
              <h1 className="font-bold text-slate-800">Déménagement</h1>
              <p className="text-xs text-slate-400">Lorgues 2026</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-3">
          {desktopNav.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                location.pathname === to
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          ))}
        </nav>
        {workspace && (
          <div className="border-t border-slate-100 p-4">
            <button
              onClick={() => syncItems()}
              disabled={itemsSyncing || !online}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-200 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${itemsSyncing ? 'animate-spin' : ''}`} />
              Synchroniser
            </button>
          </div>
        )}
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col pb-20 lg:pb-0">
        <OfflineBanner online={online} />
        <main className="flex-1">{children}</main>
        <InstallPrompt />
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-slate-200 bg-white lg:hidden">
        {mobileNav.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-xs ${
              location.pathname === to ? 'text-brand-600' : 'text-slate-400'
            }`}
          >
            <Icon className="h-6 w-6" />
            <span className="font-medium">{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
