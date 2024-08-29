<template>
  <IonPage
    class="page"
  >
    <SyncProgress
      class="progressBlock"
      :steps="syncSteps"
    />
  </IonPage>
</template>


<script setup lang="ts">
import { useFluent } from 'fluent-vue'
import { IonPage, useIonRouter } from '@ionic/vue'
import { onMounted, reactive } from 'vue'
import { SyncProgressEvent, useFullSync } from '@lectorium/shared'
import { SyncProgress, SyncStep } from '@lectorium/welcome'

// ── Dependencies ────────────────────────────────────────────────────
const sync = useFullSync()
const router = useIonRouter()
const { $t } = useFluent()

// ── State ───────────────────────────────────────────────────────────
const syncSteps = reactive<SyncStep[]>([
  { name: $t('dictionary'),   progress: 0 },
  { name: $t('tracks'),       progress: 0 },
  { name: $t('transcripts'),  progress: 0 },
  { name: $t('search-index'), progress: 0 },
])

sync.progress.subscribe((event: SyncProgressEvent) => {
  if (event.to.db.name.startsWith('library-dictionary')) {
    syncSteps[0].progress = event.percent
  }
  if (event.to.db.name.startsWith('library-tracks')) {
    syncSteps[1].progress = event.percent
  }
  if (event.to.db.name.startsWith('library-transcripts')) {
    syncSteps[2].progress = event.percent
  }
  if (event.to.db.name.startsWith('library-index')) {
    syncSteps[3].progress = event.percent
  }

  console.log(`Sync progress: ${event.to.db.name} ${event.percent}%`)
})

// ── Hooks ───────────────────────────────────────────────────────────
onMounted(async () => {
  await sync.execute()
  router.replace({ 'name': 'playlist' })
})
</script>


<style scoped>
.progressBlock {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>