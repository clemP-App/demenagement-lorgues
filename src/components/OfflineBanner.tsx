import { AlertTriangle, CheckCircle2, Clock, X } from 'lucide-react'

interface OfflineBannerProps {
  online: boolean
  onDismiss?: () => void
}

export function OfflineBanner({ online }: OfflineBannerProps) {
  if (online) return null
  return (
    <div className="flex items-center gap-2 bg-amber-500 px-4 py-2 text-sm font-medium text-white">
      <AlertTriangle className="h-4 w-4 shrink-0" />
      <span>Mode hors ligne — consultation uniquement</span>
    </div>
  )
}

export function AlertBanner({
  type,
  message,
  onClose,
}: {
  type: 'warning' | 'success' | 'info' | 'danger'
  message: string
  onClose?: () => void
}) {
  const styles = {
    warning: 'bg-orange-50 border-orange-200 text-orange-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    danger: 'bg-red-50 border-red-200 text-red-800',
  }
  const icons = {
    warning: AlertTriangle,
    success: CheckCircle2,
    info: Clock,
    danger: AlertTriangle,
  }
  const Icon = icons[type]

  return (
    <div className={`flex items-start gap-3 rounded-xl border p-4 ${styles[type]}`}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <p className="flex-1 text-sm font-medium">{message}</p>
      {onClose && (
        <button onClick={onClose} className="shrink-0 opacity-60 hover:opacity-100">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
