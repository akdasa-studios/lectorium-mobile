<template>
  <IonItem @click="onItemClicked">
    <IonIcon
      v-if="playingStatusIcon.icon"
      aria-hidden="true"
      :icon="playingStatusIcon.icon"
      :color="playingStatusIcon.color"
      slot="end"
    />
    <IonLabel class="ion-text-nowrap">
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
import { headset, checkmarkCircle, checkmarkDoneCircle, caretDownCircle } from 'ionicons/icons'
import { computed } from 'vue';

// ── Interface ───────────────────────────────────────────────────────
const props = defineProps<
  Omit<TrackViewModel, 'trackId'>
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
  [PlayingStatus.Playing]: { icon: headset,             color: 'primary' },
  [PlayingStatus.Paused]:  { icon: headset,             color: 'medium' },
  [PlayingStatus.Stoped]:  { icon: headset,             color: 'primary' },
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
