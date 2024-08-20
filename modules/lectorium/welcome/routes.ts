import { RouteRecordRaw } from 'vue-router'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/welcome',
    name: 'welcome',
    component: () => import('./pages/WelcomePage.vue'),
  },
]
