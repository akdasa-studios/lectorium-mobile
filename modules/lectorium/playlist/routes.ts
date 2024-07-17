import { RouteRecordRaw } from 'vue-router'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/app/playlist',
    name: 'playlist',
    component: () => import('./pages/PlaylistIndexPage.vue')
  },
]

