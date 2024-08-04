<template>
  <IonList>
    <MediaItem
      v-for="item in items"
      :title="item.title"
      :size="item.size"
      :status="item.status"
    />
  </IonList>
</template>


<script setup lang="ts">
import { IonList } from '@ionic/vue'
import { default as MediaItem, type MediaItemViewModel } from './MediaItem.vue'

// ── Interface ───────────────────────────────────────────────────────
defineProps<{
  items: MediaItemViewModel[]
}>()
</script>
