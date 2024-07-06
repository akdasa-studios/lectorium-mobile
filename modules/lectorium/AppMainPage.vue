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
import { onUnmounted, ref, computed, watch } from 'vue'
import { IonPage, IonContent, createGesture } from '@ionic/vue'
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
const pageTranslateOffset  = ref(0)
const pageTranslateOffsetCss = computed(() => `${pageTranslateOffset.value}px`)

const playerSectionRef     = ref<InstanceType<typeof IonContent>>()
const playerSectionState   = ref<BottomDrawerState>("closed")
const playerSectionGesture = ref<ReturnType<typeof createGesture>>()
const playerSectionGesture2 = ref<ReturnType<typeof createGesture>>()
const currentTrack  = ref<Track>()
const percentPlayed = computed(() => audioPlayer.position.value / audioPlayer.duration.value * 100)
const animation = ref("0.5s")

// ── Hooks ───────────────────────────────────────────────────────────
//@ts-ignore
watch(() => playerSectionRef.value?.handleTopRef?.$el, (value) => {
  playerSectionGesture.value = swipeVerticalGesture.create({
    el: value,
    onStart: ev => { ev.data = playerSectionState.value; },
    onEnd: ev => {
      animation.value = "0.5s";
      if (ev.data === "open" && pageTranslateOffset.value > 10) {
        playerSectionState.value = "semi-open"
      } else if (ev.data === "semi-open" && pageTranslateOffset.value > 10) {
        playerSectionState.value = "closed";
        audioPlayer.stop();
        playlist.currentTrackId.value = ""
      } else if (pageTranslateOffset.value < -100) {
        playerSectionState.value = "open"
      }
      pageTranslateOffset.value = 0
    },
    onMove: ev => { pageTranslateOffset.value = ev.deltaY; animation.value = "0s"; }
  });
})

//@ts-ignore
watch(() => playerSectionRef.value?.handleBottomRef?.$el, (value) => {
  playerSectionGesture.value = swipeVerticalGesture.create({
    el: value,
    onEnd: ev => {
      animation.value = "0.5s";
      if (pageTranslateOffset.value > 10) {
        playerSectionState.value = "semi-open"
      }
      pageTranslateOffset.value = 0
    },
    onMove: ev => { pageTranslateOffset.value = ev.deltaY; animation.value = "0s"; }
  });
})

onUnmounted(() => {
  playerSectionGesture.value?.destroy()
  playerSectionGesture2.value?.destroy()
})

watch(playlist.currentTrackId, async (value) => {
  playerSectionState.value = value ? "semi-open" : "closed";
  if (!value) return;
  currentTrack.value = await library.tracks.getLecture(value)
}, { immediate: true })

</script>

<style scoped>
.page {
  transition: all v-bind(animation);
  transform: translateY(calc(v-bind(pageTranslate) + v-bind(pageTranslateOffsetCss)));
  gap: 10px;
  background-color: var(--ion-color-medium);
  height: 200%;
}
</style>