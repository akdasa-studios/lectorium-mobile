<template>
  <IonItem @click="onItemClicked">
    <IonIcon 
      v-if="isPlaying"
      aria-hidden="true"
      :icon="playingStatusIcon"
      slot="end"
    />
    <IonLabel>
      <h3>
        <b>{{ references[0] }}</b>
        {{ title }}
      </h3>
      <p>{{ location }}</p>
    </IonLabel>
  </IonItem>
</template>


<script setup lang="ts">
import { IonItem, IonLabel, IonIcon } from '@ionic/vue'
import { PlayingStatus, type TrackViewModel } from './TrackViewModel'
import { play, pause } from 'ionicons/icons'
import { computed } from 'vue';

// ── Interface ───────────────────────────────────────────────────────
const props = defineProps<
  Omit<TrackViewModel, 'id'>
>()

const emit = defineEmits<{
  click: []
}>()

// ── State ───────────────────────────────────────────────────────────
const statusIconMaps = {
  [PlayingStatus.Playing]: play,
  [PlayingStatus.Paused]: pause,
  [PlayingStatus.None]: undefined
}
const trackIsPlayingStatuses = [
  PlayingStatus.Playing,
  PlayingStatus.Paused
]

const isPlaying = computed(
  () => trackIsPlayingStatuses.includes(props.playingStatus)
)
const playingStatusIcon = computed(
  () => statusIconMaps[props.playingStatus]
)

// ── Handlers ────────────────────────────────────────────────────────
function onItemClicked() {
  emit('click')
}
</script>

