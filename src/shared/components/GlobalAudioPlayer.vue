<template>
  <audio 
    ref="audioRef"
  />
</template>


<script lang="ts" setup>
import { useMediaControls, syncRef } from '@vueuse/core'
import { ref, toRefs, watch } from 'vue'
import { useGlobalAudioPlayer } from '@/shared/composables'

const audioRef = ref()
const globalAudioPlayer = useGlobalAudioPlayer()
const player = useMediaControls(audioRef, { src: globalAudioPlayer.url })

syncRef(globalAudioPlayer.playing, player.playing)
syncRef(globalAudioPlayer.position, player.currentTime)
</script>
