import { createRouter, createWebHistory } from '@ionic/vue-router'
import { RouteRecordRaw } from 'vue-router'
import AppMainPage from './AppMainPage.vue'
import { routes as LibraryRoutes } from './library/routes'
import { routes as PlaylistRoutes } from './playlist/routes'
import { routes as SettingsRoutes } from './settings/routes'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/app/playlist'
  },
  {
    path: '/app/',
    component: AppMainPage,
    children: [
      {
        path: '',
        redirect: '/app/playlist'
      },
      ...LibraryRoutes,
      ...PlaylistRoutes,
      ...SettingsRoutes
    ]
  }
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
