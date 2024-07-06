<template>
  <IonPage class="page">
    <MainSection
      :shrink="playerSectionState !== 'closed'"
    />
    <PlayerSection
      ref="playerSectionRef"
      :playing="audioPlayer.playing.value"
      :position="audioPlayer.position.value"
      :percentPlayed="percentPlayed"
      :track="currentTrack"
      @play-clicked="audioPlayer.togglePlaying()"
      @rewind="audioPlayer.position.value = $event"
    />
  </IonPage>
</template>


<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed, watch } from 'vue'
import { IonPage, IonContent, createGesture, GestureDetail } from '@ionic/vue'
import { Track } from '@core/models'
import { useAudioPlayer, usePlaylist } from '@lectorium/shared/composables'
import { useLibrary } from '@lectorium/library/composables'
import { MainSection, PlayerSection, useSwipeVerticallyGesture } from '@lectorium/app'

// ── Dependencies ────────────────────────────────────────────────────
const audioPlayer = useAudioPlayer()
const playlist = usePlaylist()
const library = useLibrary()
const swipeVerticalGesture = useSwipeVerticallyGesture()

// ── State ───────────────────────────────────────────────────────────
type BottomDrawerState = "closed" | "semi-open" | "open"
const pageTranslate        = computed(() => playerSectionState.value === "open" ? "-50%" : "0%")
const playerSectionRef     = ref<InstanceType<typeof IonContent>>()
const playerSectionState   = ref<BottomDrawerState>("closed")
const playerSectionGesture = ref<ReturnType<typeof createGesture>>()
const currentTrack  = ref<Track>()
const percentPlayed = computed(() => audioPlayer.position.value / audioPlayer.duration.value * 100)

// ── Hooks ───────────────────────────────────────────────────────────
onMounted(() => {
  playerSectionGesture.value = swipeVerticalGesture.create({
    el: playerSectionRef.value?.$el,
    onStart: ev => {
      ev.data = playerSectionState.value;
      return true;
    },
    onMove: ev => onplayerSectionGestureMove(ev)
  });

})

onUnmounted(() => {
  playerSectionGesture.value?.destroy()
})

watch(playlist.currentTrackId, async (value) => {
  playerSectionState.value = value ? "semi-open" : "closed";
  if (!value) return;
  currentTrack.value = await library.tracks.getLecture(value)
}, { immediate: true })

// ── Handlers ────────────────────────────────────────────────────────
function onplayerSectionGestureMove(ev: GestureDetail) {
  if (ev.velocityY > 1 && ev.data === "open") {
    playerSectionState.value = "semi-open"
  } else if (ev.velocityY > 1 && ev.data === "semi-open") {
    playerSectionState.value = "closed";
    audioPlayer.stop();
    playlist.currentTrackId.value = ""
  } else if (ev.velocityY < -1) {
    playerSectionState.value = "open"
  }
}
</script>

<style scoped>
.page {
  transition: all 0.5s;
  transform: translateY(v-bind(pageTranslate));
  gap: 10px;
  background-color: var(--ion-color-medium);
  height: 200%;
}
</style>