import { StatusBar } from '@capacitor/status-bar'
import { isPlatform } from '@ionic/vue'

export async function initStatusBar() {
  try {
    const isAndroid = isPlatform('android')
    if (isAndroid) {
      await StatusBar.setOverlaysWebView({ overlay: true })
    }
  } catch (e) {
    console.error('Failed to init status bar', e)
  }
}