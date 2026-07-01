import { Routes, Route, Navigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { Layout } from '@/components/Layout'
import { WelcomeScreen } from '@/components/WelcomeScreen'
import { DashboardPage } from '@/pages/DashboardPage'
import { EcheancierPage } from '@/pages/EcheancierPage'
import { PreparationPage } from '@/pages/PreparationPage'
import { VoituresPage } from '@/pages/VoituresPage'
import { DocumentsPage } from '@/pages/DocumentsPage'
import { BudgetPage } from '@/pages/BudgetPage'
import { ActivityPage } from '@/pages/ActivityPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { PlusPage } from '@/pages/PlusPage'
import { SearchPage } from '@/pages/SearchPage'

export default function App() {
  const { workspace, workspaceLoading } = useApp()

  if (workspaceLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    )
  }

  if (!workspace) {
    return <WelcomeScreen />
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/echeancier" element={<EcheancierPage />} />
        <Route path="/preparation" element={<PreparationPage />} />
        <Route path="/demarches" element={<Navigate to="/preparation" replace />} />
        <Route path="/cartons" element={<Navigate to="/preparation" replace />} />
        <Route path="/voitures" element={<VoituresPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/budget" element={<BudgetPage />} />
        <Route path="/activite" element={<ActivityPage />} />
        <Route path="/parametres" element={<SettingsPage />} />
        <Route path="/plus" element={<PlusPage />} />
        <Route path="/recherche" element={<SearchPage />} />
        <Route path="/contacts" element={<Navigate to="/parametres" replace />} />
        <Route path="/verifications" element={<Navigate to="/echeancier" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
