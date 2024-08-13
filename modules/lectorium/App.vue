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
import { onMounted, ref } from 'vue'
import { IonApp, IonRouterOutlet, IonLoading } from '@ionic/vue'
import { GlobalAudioPlayer } from '@lectorium/shared/containers'
import { useConfig } from '@lectorium/shared/composables'
import { SyncProgress, useSync } from '@lectorium/shared'
import { useUserData } from './playlist'

// ── Dependencies ────────────────────────────────────────────────────
const sync = useSync()
const config = useConfig()
const data = useUserData()

// ── State ───────────────────────────────────────────────────────────
const syncMessage = ref('Syncing...')

// ── Hooks ───────────────────────────────────────────────────────────
onMounted(async () => {
  // Start full sync
  await sync.execute({
    dictionaryData: { enabled: true },
    trackInfos: { enabled: true },
    searchIndex: { enabled: true },
    trackTranscripts: {
      enabled: true,
      trackIds: await data.playlistItems.service.getTrackIds()
    }
  }, (progress: SyncProgress) => {
    syncMessage.value = progress.task + ' ' + progress.documentsPending
  })
})
</script>
