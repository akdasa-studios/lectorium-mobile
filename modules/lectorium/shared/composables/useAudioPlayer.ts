import { ref } from 'vue'
import { createGlobalState, useEventBus } from '@vueuse/core'
import type { EventBusKey } from '@vueuse/core'

export const Rewind: EventBusKey<{ position: number }> = Symbol('rewind')
export const Playing: EventBusKey<{ trackId: string, position?: number }> = Symbol('playing')
export const Close: EventBusKey<{ trackId: string }> = Symbol('close')
export const AudioPlayerEventBus = {
  rewind: useEventBus(Rewind),
  open: useEventBus(Playing),
  close: useEventBus(Close)
}

export const useAudioPlayer = createGlobalState(() => {
  function play(
    trackId: string,
    position?: number
  ) {
    console.log('play', trackId, position)

    AudioPlayerEventBus.open.emit({ trackId, position })
    _trackId.value = trackId
    _position.value = position || 0
    _playing.value = true
  }

  function togglePause() {
    _playing.value = !_playing.value
  }

  function stop() {
    console.log('stop')

    if (!_trackId.value) return
    AudioPlayerEventBus.close.emit({ trackId: _trackId.value })
    _playing.value = false
    _trackId.value = undefined
  }

  function rewindTo(position: number) {
    AudioPlayerEventBus.rewind.emit({ position })
  }

  const _trackId = ref<string|undefined>(undefined)
  const _position = ref(0)
  const _duration = ref(0)
  const _playing = ref(false)

  return {
    bus: AudioPlayerEventBus,
    play,
    togglePause,
    stop,
    rewindTo,
    position: _position,
    duration: _duration,
    playing: _playing,
    trackId: _trackId
  }
})
