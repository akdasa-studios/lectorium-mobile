import { isPlatform } from '@ionic/vue'
import { NavigationBar } from '@hugotomazi/capacitor-navigation-bar'

export async function initNavigationBar() {
  try {
    const isAndroid = isPlatform('android')
    if (isAndroid) {
      await NavigationBar.setColor({ color: "#ffffff", darkButtons: true })
    }
  } catch (e) {
    console.error('Failed to init navigation bar', e)
  }
}

