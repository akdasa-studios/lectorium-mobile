<template>
  <IonApp>
    <IonRouterOutlet />
    <GlobalAudioPlayer />

    <IonLoading
      :is-open="sync.inProgress.value && !config.lastSyncedAt.value"
      :message="syncMessage"
    />
  </IonApp>
</template>


<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { IonApp, IonRouterOutlet, IonLoading } from '@ionic/vue'
import { GlobalAudioPlayer } from '@lectorium/shared/containers'
import { useConfig } from '@lectorium/shared/composables'
import { useSync } from '@lectorium/shared'
import { useUserData } from './playlist'

// ── Dependencies ────────────────────────────────────────────────────
const sync = useSync()
const config = useConfig()
const data = useUserData()

// ── State ───────────────────────────────────────────────────────────
const documentsPendingToSync = ref(0);
const syncMessage = computed(() => {
  return  documentsPendingToSync.value > 0 ?
    `${documentsPendingToSync.value} remains...` : "Loading data."
})

// ── Hooks ───────────────────────────────────────────────────────────
onMounted(async () => {
  await sync.execute({
    trackIds: await data.playlistItems.service.getTrackIds()
  })
})

watch(sync.documentsPendingToSync, async (value) => {
  documentsPendingToSync.value = value
})
</script>
