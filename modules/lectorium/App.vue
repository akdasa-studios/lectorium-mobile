<template>
  <IonApp>
    <IonRouterOutlet />
    <GlobalAudioPlayer />

    <IonLoading
      :is-open="sync.inProgress.value && !config.lastSyncedAt.value"
      message="Loading data..."
    />
  </IonApp>
</template>


<script setup lang="ts">
import { onMounted } from 'vue'
import { IonApp, IonRouterOutlet, IonLoading } from '@ionic/vue'
import { GlobalAudioPlayer } from '@lectorium/shared/containers'
import { useConfig } from '@lectorium/shared/composables'
import { useSync } from '@lectorium/shared'
import { useUserData } from './playlist'

// ── Dependencies ────────────────────────────────────────────────────
const sync = useSync()
const config = useConfig()
const data = useUserData()

// ── Hooks ───────────────────────────────────────────────────────────
onMounted(async () => {
  await sync.execute({
    trackIds: await data.playlistItems.service.getTrackIds()
  })
})
</script>
