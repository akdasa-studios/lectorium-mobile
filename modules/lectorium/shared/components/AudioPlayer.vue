<template>
  <audio ref="audioRef" />
</template>


<script lang="ts" setup>
import { useMediaControls, watchThrottled } from '@vueuse/core'
import { ref, watch } from 'vue'

// ── Interface ───────────────────────────────────────────────────────
const playing  = defineModel<boolean>('playing', { default: false, required: true })
const position = defineModel<number>('position', { default: 0, required: true })
const duration = defineModel<number>('duration', { default: 0, required: true })
const url      = defineModel<string>('url', { default: '', required: true })

// ── State ───────────────────────────────────────────────────────────
const audioRef = ref()
const player = useMediaControls(audioRef, { src: url })

// ── Hooks ───────────────────────────────────────────────────────────

// Note: setting playing to true doesn't start the audio immediately
//       it will be started when the url is set and the player is not waiting
watch([playing, url, player.waiting], () => {
  if (url.value && playing.value && !player.waiting.value) {
    player.currentTime.value = position.value
    player.playing.value = true
  }

  if (!playing.value) { player.playing.value = false }
})

// Note: throttle the position update to avoid too many updates
watchThrottled(
  player.currentTime,
  (v) => { position.value = v },
  { throttle: 1000 }
)

watch(
  player.duration,
  (v) => { duration.value = v }
)

watch(
  position,
  (v) => { player.currentTime.value = v }
)
</script>
