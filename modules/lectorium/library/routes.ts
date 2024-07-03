import { RouteRecordRaw } from 'vue-router'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/app/library',
    component: () => import('./pages/LibraryIndexPage.vue')
  },
]

