import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { IonicVue } from '@ionic/vue'

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css'
import '@ionic/vue/css/structure.css'
import '@ionic/vue/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css'
import '@ionic/vue/css/float-elements.css'
import '@ionic/vue/css/text-alignment.css'
import '@ionic/vue/css/text-transformation.css'
import '@ionic/vue/css/flex-utils.css'
import '@ionic/vue/css/display.css'

/* I18n */
import { i18n } from './i18n'

/* Theme variables */
import './theme.css'

/* */
import {
  runCleanupFiles,
  runConfigPersistence,
  runDownloadMediaItems,
  runSyncMediaItemsWithPlaylist,
  runSyncTranscriptsWithPlaylist,
  runPlaylistPersistence,
  runRestoreFailedDownloads,
  runSyncPlaylistStatus,
  runInstallPrebuiltDatabases,
  runSentryIntegration,
} from '@lectorium/shared'
import { register } from 'swiper/element/bundle'
import { initNavigationBar, runNavigationBarStyle, runStatusBarStyle } from './app'

async function createAndRunApp() {
  register()

  await runConfigPersistence()
  await runInstallPrebuiltDatabases()

  const app = createApp(App)
    .use(IonicVue)
    .use(router)
    .use(i18n)

  runSentryIntegration(app, router)

  router.isReady().then(async () => {
    await runCleanupFiles()
    await runDownloadMediaItems()
    await runSyncMediaItemsWithPlaylist()
    await runSyncTranscriptsWithPlaylist()
    await runPlaylistPersistence()
    await runRestoreFailedDownloads()
    await runSyncPlaylistStatus()

    // await initStatusBar()
    await initNavigationBar()

    await runStatusBarStyle()
    await runNavigationBarStyle()

    app.mount('#app')
  })
}

createAndRunApp()