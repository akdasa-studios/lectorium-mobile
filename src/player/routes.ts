import { RouteRecordRaw } from 'vue-router'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/app/player',
    name: 'player',
    component: () => import('./pages/PlayerPage.vue'),
  },
]

