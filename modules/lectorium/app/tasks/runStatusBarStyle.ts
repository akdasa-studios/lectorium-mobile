import { watch } from "vue"
import { useAppLayout } from "@lectorium/app"
import { StatusBar, Style } from "@capacitor/status-bar"
import { Capacitor } from "@capacitor/core"

export async function runStatusBarStyle() {
  if (!Capacitor.isPluginAvailable('StatusBar')) { return }

  const layout = useAppLayout()

  watch(layout.layoutState, async (value) => {
    if (value === 'open') {
      await StatusBar.setStyle({ style: Style.Dark })
      await StatusBar.setBackgroundColor({ color: "1D263B" })
    } else {
      await StatusBar.setBackgroundColor({ color: "ffffff" })
      await StatusBar.setStyle({ style: Style.Light })
    }
  });
}