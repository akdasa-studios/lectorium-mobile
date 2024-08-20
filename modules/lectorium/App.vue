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
import { useFullSync } from '@lectorium/shared'

// ── Dependencies ────────────────────────────────────────────────────
const sync = useFullSync()

// ── Hooks ───────────────────────────────────────────────────────────
onMounted(async () => {
  await sync.execute()
})
</script>
