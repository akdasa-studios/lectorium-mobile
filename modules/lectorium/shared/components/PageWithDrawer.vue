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

    <BottomDrawer
      :percent="percentPlayed"
      ref="bottomDrawerRef"
    >
      <AudioControlsCompact
        v-if="currentTrack"
        :title="currentTrack.title"
        :author="'Author'"
        :playing="audioPlayer.playing.value"
        @playClicked="audioPlayer.togglePlaying()"
      />

      <IonContent
        class="ion-padding text"
        color="oxford-blue"
        v-if="currentTrack"
      >
        <Prompter
          :text="currentTrack.text"
          :time="audioPlayer.position.value * 1000"
          @rewind="(pos) => audioPlayer.position.value = pos / 1000"
        />
      </IonContent>
    </BottomDrawer>

  </IonPage>
</template>


<script setup lang="ts">
import { IonPage, IonContent, createGesture, GestureDetail } from '@ionic/vue'
import { onMounted, onUnmounted, ref, computed, watch } from 'vue'
import { Drawer } from '@lectorium/shared/components'
import { useAudioPlayer, usePlaylist } from '@lectorium/shared/composables'
import { Track } from '@core/models'
import { useLibrary } from '@lectorium/library/composables'
import { Prompter } from '@lectorium/shared/components'
import AudioControlsCompact from '@lectorium/library/components/BottomDrawer/AudioControlsCompact.vue'
import { BottomDrawer

 } from '@lectorium/library/components'
type BottomDrawerState = "closed" | "semi-open" | "open"
const audioPlayer = useAudioPlayer()
const playlist = usePlaylist()

const library = useLibrary()

// ── State ───────────────────────────────────────────────────────────
const topDrawerRef = ref<InstanceType<typeof IonContent>>()
const bottomDrawerRef = ref<InstanceType<typeof IonContent>>()

const isDrawerOpen = defineModel("isDrawerOpen", { type: Boolean, default: false })
const bottomDrawerState = ref<BottomDrawerState>("closed")
const openDrawerGesture = ref<ReturnType<typeof createGesture>>()
const openBottomDrawerGesture = ref<ReturnType<typeof createGesture>>()
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

  openBottomDrawerGesture.value = createGesture({
    el: bottomDrawerRef.value?.$el,
    gestureName: 'open-bottom-drawer',
    gesturePriority: 31,
    direction: 'y',
    onMove: ev => onMoveHandler2(ev)
  });

  openDrawerGesture.value.enable();
  openBottomDrawerGesture.value.enable();
})

onUnmounted(() => {
  openDrawerGesture.value?.destroy()
  openBottomDrawerGesture.value?.destroy()
})

watch(playlist.currentTrackId, async (value) => {
  if (!value) return;
  currentTrack.value = await library.tracks.getLecture(value)
}, { immediate: true })

// ── Handlers ────────────────────────────────────────────────────────
function onMoveHandler(ev: GestureDetail): boolean | void {
  console.log("onMoveHandler", ev.velocityY)
  if (ev.velocityY > 0 && isDrawerOpen.value === false) {
    isDrawerOpen.value = true
  } else if (ev.velocityY < 0) {
    isDrawerOpen.value = false
  }
}
function onMoveHandler2(ev: GestureDetail): boolean | void {
  console.log("onMoveHandler2", ev.velocityY)
  if (ev.velocityY > 1) {
    bottomDrawerState.value = playlist.currentTrackId.value ? "semi-open" : "closed"
  } else if (ev.velocityY < -1) {
    bottomDrawerState.value = "open"
  }
}

watch(playlist.currentTrackId, (value) => {
  console.log("playlist.currentTrackId", value)
  if (value) {
    bottomDrawerState.value = "semi-open"
  } else {
    bottomDrawerState.value = "closed"
  }
}, { immediate: true })

const offsetTop = computed(() => bottomDrawerState.value === "open" ? "-50%" : "0%") //ref("-0px")
const offsetBottom = computed(() => bottomDrawerState.value === "semi-open" || bottomDrawerState.value === "open" ? "75px" : "0px") //ref("75px")
const topDrawerBorderRadius = computed(() => bottomDrawerState.value !== "closed" ? "5px" : "0px")
const percentPlayed = computed(() => audioPlayer.position.value / audioPlayer.duration.value * 100)
</script>



<style scoped>
.page {
  transition: all 0.5s;
  transform: translateY(v-bind(offsetTop));
  gap: 10px;
  background-color: var(--ion-color-medium);
  height: 200%;
}

.parts {
  transition: all 1.5s;
  overflow: hidden;
}

.topDrawer {
  flex: 0 0 calc(50% - v-bind(offsetBottom));
  border-bottom-left-radius: v-bind(topDrawerBorderRadius);
  border-bottom-right-radius: v-bind(topDrawerBorderRadius);
  box-shadow: 0px 2px 4px var(--ion-color-medium-shade);
}
</style>