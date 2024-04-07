<template>
  <IonIcon class="PlayButton" :icon="icon" />
</template>


<script setup lang="ts">
import { ref, computed } from 'vue'
import { IonIcon } from '@ionic/vue'
import { playCircle, pauseCircle } from 'ionicons/icons'

// ── Interface ───────────────────────────────────────────────────────
const props = defineProps<{
  playing: boolean
}>()

// ── State ───────────────────────────────────────────────────────────
const icon = computed(() => props.playing ? pauseCircle : playCircle)
</script>


<style scoped>
.PlayButton {
  min-width: 100px;
  min-height: 100px;
}
</style>

