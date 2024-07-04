<template>
  <IonIcon class="PlayButton" :icon="icon" />
</template>


<script setup lang="ts">
import { ref, computed, toRefs } from 'vue'
import { IonIcon } from '@ionic/vue'
import { playCircle, pauseCircle } from 'ionicons/icons'

// ── Interface ───────────────────────────────────────────────────────
const props = defineProps<{
  playing: boolean
}>()

// ── State ───────────────────────────────────────────────────────────
const { playing } = toRefs(props)
const icon = computed(() => playing.value ? pauseCircle : playCircle)
</script>


<style scoped>
.PlayButton {
  /* width: 100%; */
  /* height: 100%; */
  min-width: 40px;
  min-height: 40px;
}
</style>

