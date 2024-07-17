import { RouteRecordRaw } from 'vue-router'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/app/settings',
    name: 'settings',
    component: () => import('./pages/SettingsPage.vue'),
  },
]
