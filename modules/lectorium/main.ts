import { ENVIRONMENT } from '@core/env'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { IonicVue } from '@ionic/vue'

/* Sentry */
import * as Sentry from '@sentry/capacitor'
import * as SentryVue from '@sentry/vue'

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

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
} from '@lectorium/shared'
import { register } from 'swiper/element/bundle'
import { initStatusBar, initNavigationBar, runNavigationBarStyle, runStatusBarStyle } from './app'

async function createAndRunApp() {
  register()

  await runConfigPersistence()

  const app = createApp(App)
    .use(IonicVue)
    .use(router)
    .use(i18n)

  // Init sentry
  if (ENVIRONMENT.sentryDsn) {
    Sentry.init({
      app,
      dsn: ENVIRONMENT.sentryDsn,
      integrations: [
        SentryVue.browserTracingIntegration({
          router: router,
          routeLabel: 'name',
        }),
        SentryVue.replayIntegration({
          maskAllText: false,
          maskAllInputs: false,
          sessionSampleRate: 1.0,
          errorSampleRate: 1.0,
        }),
        SentryVue.metrics.metricsAggregatorIntegration(),
        new SentryVue.BrowserTracing({
          // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
          tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
          routingInstrumentation: SentryVue.vueRouterInstrumentation(router),
        }),
      ],

      // Tracing
      tracesSampleRate: 1.0, //  Capture 100% of the transactions

      // Session Replay
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    }, SentryVue.init);
  }


  router.isReady().then(async () => {
    await runCleanupFiles()
    await runDownloadMediaItems()
    await runSyncMediaItemsWithPlaylist()
    await runSyncTranscriptsWithPlaylist()
    await runPlaylistPersistence()
    await runRestoreFailedDownloads()
    await runSyncPlaylistStatus()

    await initStatusBar()
    await initNavigationBar()

    await runStatusBarStyle()
    await runNavigationBarStyle()

    app.mount('#app')
  })
}

createAndRunApp()