import { MaybeRef, computed, reactive, ref } from 'vue'
import { createGlobalState, useMediaControls } from '@vueuse/core'

export type AudioPlayerSatate = {
  trackId: string|undefined,
  position: number
  duration: number
  playing: boolean
}

export const useAudioPlayer = createGlobalState(() => {
  const state = ref<AudioPlayerSatate>({
    trackId: undefined,
    position: 0,
    duration: 0,
    playing: false
  })

  function play(
    trackId: string,
    position?: number
  ) {
    state.value = {
      trackId: trackId,
      position: position || 0,
      duration: 0,
      playing: true
    }
  }

  function togglePause() {
    state.value = {
      ...state.value,
      playing: !state.value.playing
    }
  }

  function stop() {
    state.value = {
      trackId: undefined,
      position: 0,
      duration: 0,
      playing: false
    }
  }

  function rewindTo(position: number) {
    state.value = {
      ...state.value,
      position
    }
  }


  const position = ref(0)
  const duration = ref(0)
  const playing = ref(false)
  const loading = ref(false)

  return {
    state,
    play,
    togglePause,
    stop,
    rewindTo,
    position,
    duration,
    playing,
    loading,
  }
})
