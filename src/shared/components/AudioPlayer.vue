<template>
  <audio ref="audioRef" />
</template>


<script lang="ts" setup>
import { useMediaControls, watchThrottled } from '@vueuse/core'
import { ref, watch } from 'vue'

// ── Interface ───────────────────────────────────────────────────────
const playing  = defineModel('playing',  { type: Boolean, default: false })
const position = defineModel('position', { type: Number,  default: 0 })
const url      = defineModel('url',      { type: String,  default: '' })

// ── State ───────────────────────────────────────────────────────────
const audioRef = ref()
const player = useMediaControls(audioRef, { src: url })

// ── Hooks ───────────────────────────────────────────────────────────

// Note: setting playing to true doesn't start the audio immediately
//       it will be started when the url is set
watch([playing, url], () => {
  if (url.value && playing.value) {
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
</script>
