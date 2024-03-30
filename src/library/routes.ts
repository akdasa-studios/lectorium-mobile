import { RouteRecordRaw } from 'vue-router'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/app/library',
    component: () => import('./pages/LibraryIndexPage.vue')
  },
  {
    path: '/app/library/:id',
    name: 'lecture',
    component: () => import('./pages/LibraryPlayerPage.vue'),
    props: route => ({
      lectureId: route.params.id as string
    }),
  },
]

