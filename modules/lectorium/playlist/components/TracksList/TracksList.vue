<template>
  <IonList>
    <IonItemSliding
      v-for="item in items"
      :key="item.trackId"
    >
      <TracksListItem
        :track-id="item.trackId"
        :title="item.title"
        :location="item.location"
        :date="item.date"
        :references="item.references"
        :playing-status="item.playingStatus"
        @click="onTrackClicked(item)"
      />

      <IonItemOptions>
        <IonItemOption
          color="danger"
          @click="onRemoveClicked(item)"
        >
          <IonIcon
            slot="icon-only"
            :icon="trash"
          />
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>

  </IonList>
</template>


<script setup lang="ts">
import { IonList, IonItemSliding, IonItemOptions, IonItemOption, IonIcon } from '@ionic/vue'
import TracksListItem from './TracksListItem.vue'
import { type TrackViewModel } from './TrackViewModel'
import { trash } from 'ionicons/icons'

// ── Interface ───────────────────────────────────────────────────────
defineProps<{
  items: TrackViewModel[]
}>()

const emit = defineEmits<{
  click: [track: TrackViewModel]
  remove: [track: TrackViewModel]
}>()

// ── Handlers ────────────────────────────────────────────────────────
function onTrackClicked(track: TrackViewModel) {
  emit('click', track)
}

function onRemoveClicked(track: TrackViewModel) {
  emit('remove', track)
}
</script>
