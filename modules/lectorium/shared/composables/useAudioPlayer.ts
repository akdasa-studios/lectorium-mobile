import { ref } from 'vue'
import { createGlobalState, useEventBus } from '@vueuse/core'
import { useLibrary } from '@lectorium/library'
import { useUserData } from './useUserData'
import { Capacitor } from '@capacitor/core'
import { Directory, Filesystem } from '@capacitor/filesystem'
import { AudioPlayer } from '@core/plugins'

// export const Rewind: EventBusKey<{ position: number }> = Symbol('rewind')
// export const Playing: EventBusKey<{ trackId: string, position?: number }> = Symbol('playing')
// export const Close: EventBusKey<{ trackId: string }> = Symbol('close')
// export const AudioPlayerEventBus = {
//   rewind: useEventBus(Rewind),
//   // open: useEventBus(Playing),
//   close: useEventBus(Close)
// }

export const useAudioPlayer = createGlobalState(() => {
  const library = useLibrary()
  const userData = useUserData()

  AudioPlayer.onProgressChanged((v) => {
    console.log(JSON.stringify(v))
    _trackId.value  = v.trackId
    _position.value = v.position
    _duration.value = v.duration
    _playing.value  = v.playing
  })

  async function play(
    trackId: string,
    position?: number
  ) {
    const track = await library.tracks.getTrack(trackId)
    const media = await userData.media.getByUrl(track.url)
    if (!media || media.state !== "downloaded") { return "" }

    // Get path to the media file according to the platform.
    const isWeb = Capacitor.getPlatform() === "web"
    const audioSource = isWeb
      ? media.remoteUrl
      : (await Filesystem.getUri({
          directory: Directory.Data,
          path: media.localPath
        })).uri

    // Play the track and seek to the position if needed.
    await AudioPlayer.open({
      trackId: track.id,
      url: audioSource,
      title: track.title,
      author: await library.authors.getLocalizedName(track.author, "ru"),
    })
    if (position) {
      await AudioPlayer.seek({
        position: position
      })
    }
  }

  async function togglePause() {
    await AudioPlayer.togglePause()

    // _playing.value = !_playing.value
  }

  async function stop() {
    await AudioPlayer.stop()
    // console.log('stop')

    // if (!_trackId.value) return
    // AudioPlayerEventBus.close.emit({ trackId: _trackId.value })
    // _playing.value = false
    // _trackId.value = undefined
  }

  async function seek(position: number) {
    await AudioPlayer.seek({ position })
    // AudioPlayerEventBus.rewind.emit({ position })
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
