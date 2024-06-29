<template>
  <IonList>
    <TracksListItem
      v-for="item in items"
      :key="item.id"
      :title="item.title"
      :location="item.location"
      :references="item.references"
      :playing-status="item.playingStatus"
      @click="onTrackClicked(item.id)"
    />
  </IonList>
</template>


<script setup lang="ts">
import { IonList } from '@ionic/vue'
import TracksListItem from './TracksListItem.vue'
import { type TrackViewModel } from './TrackViewModel'

// ── Interface ───────────────────────────────────────────────────────
defineProps<{
  items: TrackViewModel[]
}>()

const emit = defineEmits<{
  click: [trackId: string]
}>()

// ── Handlers ────────────────────────────────────────────────────────
function onTrackClicked(trackId: string) {
  emit('click', trackId)
}
</script>
