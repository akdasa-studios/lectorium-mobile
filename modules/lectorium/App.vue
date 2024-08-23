<template>
  <IonApp>
    <IonRouterOutlet />
    <GlobalAudioPlayer />
  </IonApp>
</template>


<script setup lang="ts">
import { onMounted } from 'vue'
import { IonApp, IonRouterOutlet } from '@ionic/vue'
import { GlobalAudioPlayer } from '@lectorium/shared/containers'
import { useFullSync, useMetrics } from '@lectorium/shared'

// ── Dependencies ────────────────────────────────────────────────────
const sync = useFullSync()
const metrics = useMetrics()

// ── Hooks ───────────────────────────────────────────────────────────
onMounted(async () => {
  metrics.increment('app.open.count')
  await sync.execute()
})
</script>
