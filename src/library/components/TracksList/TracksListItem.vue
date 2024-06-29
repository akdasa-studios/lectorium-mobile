<template>
  <IonItem @click="onItemClicked">
    <IonIcon
      aria-hidden="true"
      :icon="playingStatusIcon.icon"
      :color="playingStatusIcon.color"
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
import { playCircle, pauseCircle, stopCircle, checkmarkCircle, checkmarkDoneCircle, caretDownCircle } from 'ionicons/icons'
import { computed } from 'vue';

// ── Interface ───────────────────────────────────────────────────────
const props = defineProps<
  Omit<TrackViewModel, 'id'>
>()

const emit = defineEmits<{
  click: []
}>()

// ── State ───────────────────────────────────────────────────────────
type StatusIconMap = {
  [key in PlayingStatus]: { icon?: string, color?: string }
}

const statusIconMaps: StatusIconMap = {
  [PlayingStatus.InQueue]: { icon: checkmarkCircle,     color: 'medium'  },
  [PlayingStatus.Loading]: { icon: caretDownCircle,     color: 'primary' },
  [PlayingStatus.Playing]: { icon: playCircle,          color: 'primary' },
  [PlayingStatus.Paused]:  { icon: pauseCircle,         color: 'primary' },
  [PlayingStatus.Stoped]:  { icon: stopCircle,          color: 'primary' },
  [PlayingStatus.Played]:  { icon: checkmarkDoneCircle, color: 'success' },
  [PlayingStatus.None]:    { icon: undefined,           color: undefined }
}
const playingStatusIcon = computed(
  () => statusIconMaps[props.playingStatus]
)

// ── Handlers ────────────────────────────────────────────────────────
function onItemClicked() {
  emit('click')
}
</script>
