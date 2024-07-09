import { isPlatform } from '@ionic/vue'
import { NavigationBar } from '@hugotomazi/capacitor-navigation-bar'
import { SafeArea } from 'capacitor-plugin-safe-area'
import { useSafeArea } from '@lectorium/app'

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
  const safeArea = useSafeArea()
  const { insets } = await SafeArea.getSafeAreaInsets()
  for (const [key, value] of Object.entries(insets)) {
    document.documentElement.style.setProperty(`--safe-area-${key}`, `${value}px`)
    if (key === 'bottom') { safeArea.bottom.value = value + 25 }
    if (key === 'top') { safeArea.top.value = value }
    if (key === 'left') { safeArea.left.value = value }
    if (key === 'right') { safeArea.right.value = value }
  }
}