import { StatusBar, Style } from '@capacitor/status-bar'
import { isPlatform } from '@ionic/vue'

export async function initStatusBar() {
  try {
    const isAndroid = isPlatform('android')
    if (isAndroid) {
      await StatusBar.setOverlaysWebView({ overlay: true })
      // await StatusBar.setBackgroundColor({ color: "#ffffff" })
      await StatusBar.setStyle({ style: Style.Light })
    }
  } catch (e) {
    console.error('Failed to init status bar', e)
  }
}