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
import { IonApp, IonRouterOutlet, IonLoading } from '@ionic/vue'
import { GlobalAudioPlayer } from '@lectorium/shared/containers'
import { useConfig } from '@lectorium/shared/composables'
import { useSync } from '@lectorium/shared'

const sync = useSync()
const config = useConfig()

sync.execute({ trackIds: [] })
</script>
