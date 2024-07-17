import { RouteRecordRaw } from 'vue-router'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/app/library',
    name: 'library',
    component: () => import('./pages/LibraryIndexPage.vue'),
  },
]

