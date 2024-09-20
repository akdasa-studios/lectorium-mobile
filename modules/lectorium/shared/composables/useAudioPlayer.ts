import { ref } from 'vue'
import { createGlobalState } from '@vueuse/core'
import { useLibrary } from '@lectorium/library'
import { Capacitor } from '@capacitor/core'
import { AudioPlayer } from '@core/plugins'
import { useUserData } from './useUserData'
import { useConfig } from './useConfig'

export const useAudioPlayer = createGlobalState(() => {
  const library = useLibrary()
  const userData = useUserData()
  const config = useConfig()

  AudioPlayer.onProgressChanged((v) => {
    _trackId.value  = v.trackId
    _position.value = v.position
    _duration.value = v.duration
    _playing.value  = v.playing
  })

  async function play(
    trackId: string,
    position?: number
  ) {
    const track = await library.tracks.getOne(trackId)
    const media = await userData.media.getByUrl(track.url)
    if (!media || media.state !== "downloaded") { return }
    if (!media.localUrl) { return }

    // Get path to the media file according to the platform.
    const isWeb = Capacitor.getPlatform() === "web"
    const audioSource = isWeb
      ? media.remoteUrl
      : media.localUrl

    // Play the track and seek to the position if needed.
    await AudioPlayer.open({
      trackId: track._id,
      url: audioSource,
      title: track.getTitle(config.locale.value),
      author: (await library.authors.getOne(track.author)).getName(config.locale.value, 'full'),
    })
    if (position) {
      await AudioPlayer.seek({
        position: position
      })
    }
    await AudioPlayer.play()
  }

  async function togglePause() {
    await AudioPlayer.togglePause()
  }

  async function stop() {
    await AudioPlayer.stop()
  }

  async function seek(position: number) {
    await AudioPlayer.seek({ position })
  }

  const _trackId = ref<string|undefined>(undefined)
  const _position = ref(0)
  const _duration = ref(0)
  const _playing = ref(false)

  return {
    play,
    togglePause,
    stop,
    seek,
    position: _position,
    duration: _duration,
    playing: _playing,
    trackId: _trackId
  }
})
