<template>
  <audio 
    ref="audioRef"
  />
</template>


<script lang="ts" setup>
import { useMediaControls, syncRef } from '@vueuse/core'
import { ref } from 'vue'

// ── Interface ───────────────────────────────────────────────────────
const playing  = defineModel('playing',  { type: Boolean, default: false })
const position = defineModel('position', { type: Number,  default: 0 })
const url      = defineModel('url',      { type: String,  default: '' })

// ── State ───────────────────────────────────────────────────────────
const audioRef = ref()
const player = useMediaControls(audioRef, { src: url })

// ── Hooks ───────────────────────────────────────────────────────────
syncRef(playing, player.playing)
syncRef(position, player.currentTime)
</script>
