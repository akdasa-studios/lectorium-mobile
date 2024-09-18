<template>
  <IonList>
    <TracksListItem
      v-for="item in items"
      :key="item.trackId"
      :track-id="item.trackId"
      :title="item.title"
      :author="item.author"
      :location="item.location"
      :date="item.date"
      :references="item.references"
      :playing-status="item.playingStatus"
      @click="onTrackClicked(item)"
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
  click: [track: TrackViewModel]
}>()

// ── Handlers ────────────────────────────────────────────────────────
function onTrackClicked(track: TrackViewModel) {
  emit('click', track)
}
</script>
