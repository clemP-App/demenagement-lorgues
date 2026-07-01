import { registerSW } from 'virtual:pwa-register'

export function registerServiceWorker() {
  const updateSW = registerSW({
    onNeedRefresh() {
      if (confirm('Une nouvelle version est disponible. Recharger ?')) {
        updateSW(true)
      }
    },
    onOfflineReady() {
      console.log('Application prête pour une utilisation hors ligne')
    },
  })
}
