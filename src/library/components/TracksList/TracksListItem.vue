<template>
  <IonItem @click="onItemClicked">
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
import { IonItem, IonLabel } from '@ionic/vue'
import { type TrackViewModel } from './TrackViewModel'

// ── Interface ───────────────────────────────────────────────────────
defineProps<
  Omit<TrackViewModel, 'id'>
>()

const emit = defineEmits<{
  click: []
}>()


// ── Handlers ────────────────────────────────────────────────────────
function onItemClicked() {
  emit('click')
}
</script>

