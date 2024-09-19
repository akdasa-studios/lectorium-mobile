import * as Sentry from '@sentry/capacitor'
import * as SentryVue from '@sentry/vue'
import { App } from 'vue'
import { Router } from 'vue-router'

import { ENVIRONMENT } from '@core/env'


export function runSentryIntegration(
  app: App<Element>,
  router: Router,
) {
    if (!ENVIRONMENT.sentryDsn) { return }

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
          tracePropagationTargets: ["localhost", /^https:\/\/app.lectorium.akdasa\.studio/],
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