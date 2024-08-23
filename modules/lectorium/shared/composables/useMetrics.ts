import * as SentryVue from '@sentry/vue'

export function useMetrics() {
  return {
    increment: SentryVue.metrics.increment,
    distribution: SentryVue.metrics.distribution,
    set: SentryVue.metrics.set,
    gauge: SentryVue.metrics.gauge,
  }
}