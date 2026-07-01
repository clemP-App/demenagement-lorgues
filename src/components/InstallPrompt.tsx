import { useState, useEffect } from 'react'
import { Download, X } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (isInstalled || dismissed || !deferredPrompt) return null

  const handleInstall = async () => {
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setDeferredPrompt(null)
  }

  return (
    <div className="mx-4 mb-4 flex items-center gap-3 rounded-xl border border-brand-200 bg-brand-50 p-4">
      <Download className="h-5 w-5 shrink-0 text-brand-600" />
      <div className="flex-1">
        <p className="text-sm font-semibold text-brand-800">Installer l'application</p>
        <p className="text-xs text-brand-600">Accès rapide depuis votre écran d'accueil</p>
      </div>
      <button
        onClick={handleInstall}
        className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700"
      >
        Installer
      </button>
      <button onClick={() => setDismissed(true)} className="text-brand-400 hover:text-brand-600">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
