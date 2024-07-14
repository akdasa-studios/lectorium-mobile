import { watch } from "vue"
import { useAppLayout } from "@lectorium/app"
import { NavigationBar } from "@hugotomazi/capacitor-navigation-bar"
import { isPlatform } from "@ionic/vue"

export async function runNavigationBarStyle() {
  if (!isPlatform("android")) { return }

  const layout = useAppLayout()

  watch(layout.layoutState, async (value) => {
    if (value === 'closed') {
      await NavigationBar.setColor({ color: '#ffffff', darkButtons: true })
    } else {
      await NavigationBar.setColor({ color: "#1D263B", darkButtons: false  })
    }
  });
}