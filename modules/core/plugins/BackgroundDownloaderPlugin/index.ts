import { registerPlugin } from '@capacitor/core'
import { type BackgroundDownloaderPlugin } from './interface'
export * from './interface'


export const BackgroundDownloader = registerPlugin<BackgroundDownloaderPlugin>('BackgroundDownloader', {
  web: () => import('./web').then(m => new m.WebBackgroundDownloaderPlugin()),
})
