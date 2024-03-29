import { createRouter, createWebHistory } from '@ionic/vue-router'
import { RouteRecordRaw } from 'vue-router'
import AppMainPage from './AppMainPage.vue'
import { routes as LibraryRoutes } from './library/routes'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/app/library'
  },
  {
    path: '/app/',
    component: AppMainPage,
    children: [
      {
        path: '',
        redirect: '/app/library'
      },
      ...LibraryRoutes
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
