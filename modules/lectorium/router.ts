import { createRouter, createWebHistory } from '@ionic/vue-router'
import { RouteRecordRaw } from 'vue-router'
import AppMainPage from './AppMainPage.vue'
import { routes as LibraryRoutes } from './library/routes'
import { routes as PlaylistRoutes } from './playlist/routes'
import { routes as SettingsRoutes } from './settings/routes'
import { routes as WelcomeRoutes } from './welcome/routes'
import { useConfig } from '@lectorium/shared'

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
      ...SettingsRoutes,
    ]
  },
  ...WelcomeRoutes,
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from) => {
  const config = useConfig()
  const isSynced = config.lastSyncedAt.value > 0
  const isDbInstalled = config.prebuiltDbInstalled.value === 'installed'
  const shouldSync = !isSynced && !isDbInstalled

  if (shouldSync && to.name !== 'welcome') {
    return { name: 'welcome' }
  } else if (isSynced && to.name === 'welcome') {
    return { name: 'playlist' }
  }
})


export default router
