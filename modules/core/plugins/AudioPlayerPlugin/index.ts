import { registerPlugin } from '@capacitor/core'
import { AudioPlayerPlugin } from './interface'


export const AudioPlayer = registerPlugin<AudioPlayerPlugin>('AudioPlayer', {
  // web: () => import('./web').then(m => new m.WebAudioPlayerPlugin()),
})
