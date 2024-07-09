import { isPlatform } from '@ionic/vue'
import { NavigationBar } from '@hugotomazi/capacitor-navigation-bar'
import { SafeArea } from 'capacitor-plugin-safe-area'

export async function initNavigationBar() {
  try {
    const isAndroid = isPlatform('android')
    if (isAndroid) {
      await NavigationBar.setTransparency({ isTransparent: true })
      SafeArea.addListener('safeAreaChanged', updateInsets)
      updateInsets()
    }
  } catch (e) {
    console.error('Failed to init navigation bar', e)
  }
}


async function updateInsets () {
  console.log('updateInsets')
  const { insets } = await SafeArea.getSafeAreaInsets()
  for (const [key, value] of Object.entries(insets)) {
    document.documentElement.style.setProperty(`--safe-area-${key}`, `${value}px`)
    console.log(`--safe-area-${key}: ${value+100}px`)
  }
}