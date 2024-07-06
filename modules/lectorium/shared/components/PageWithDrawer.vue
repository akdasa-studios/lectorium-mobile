<template>
  <IonPage
    class="page"
  >
    <IonContent
      class="parts topDrawer"
      ref="topDrawerRef"
    >
      <Drawer :open="isDrawerOpen">
        <slot name="drawer"></slot>
      </Drawer>

      <slot></slot>
    </IonContent>
  </IonPage>
</template>


<script setup lang="ts">
import { IonPage, IonContent, createGesture, GestureDetail } from '@ionic/vue'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { Drawer } from '@lectorium/shared/components'
import { usePlaylist } from '@lectorium/shared/composables'
import { Track } from '@core/models'
import { useLibrary } from '@lectorium/library/composables'

const playlist = usePlaylist()
const library = useLibrary()

// ── State ───────────────────────────────────────────────────────────
const topDrawerRef = ref<InstanceType<typeof IonContent>>()

const isDrawerOpen = defineModel("isDrawerOpen", { type: Boolean, default: false })
const openDrawerGesture = ref<ReturnType<typeof createGesture>>()
const currentTrack = ref<Track>()

// ── Hooks ───────────────────────────────────────────────────────────
onMounted(() => {
  openDrawerGesture.value = createGesture({
    el: topDrawerRef.value?.$el,
    gestureName: 'my-gesture',
    gesturePriority: 31,
    direction: 'y',
    onMove: ev => onMoveHandler(ev)
  });

  openDrawerGesture.value.enable();
})

onUnmounted(() => {
  openDrawerGesture.value?.destroy()
})

watch(playlist.currentTrackId, async (value) => {
  if (!value) return;
  currentTrack.value = await library.tracks.getLecture(value)
}, { immediate: true })

// ── Handlers ────────────────────────────────────────────────────────
function onMoveHandler(ev: GestureDetail): boolean | void {
  if (ev.velocityY > 0 && isDrawerOpen.value === false) {
    isDrawerOpen.value = true
  } else if (ev.velocityY < 0) {
    isDrawerOpen.value = false
  }
}
</script>
