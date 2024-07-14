<template>
  <IonPage class="page">
    <MainSection
      :shrink-size="mainSectionShrinkSize"
    />
    <PlayerSection
      ref="playerSectionRef"
      :playing="audioPlayer.state.value.playing"
      :position="audioPlayer.state.value.position"
      :percentPlayed="percentPlayed"
      :track="currentTrack"
      @play-clicked="audioPlayer.togglePause()"
      @rewind="(to) => audioPlayer.rewindTo(to)"
    />
  </IonPage>
</template>


<script setup lang="ts">
import { onUnmounted, ref, computed, watch } from 'vue'
import { IonPage, IonContent, createGesture } from '@ionic/vue'
import { Track } from '@core/models'
import { useAudioPlayer } from '@lectorium/shared/composables'
import { useLibrary } from '@lectorium/library/composables'
import { MainSection, PlayerSection, useSwipeVerticallyGesture } from '@lectorium/app'
import { NavigationBar } from '@hugotomazi/capacitor-navigation-bar'

// ── Dependencies ────────────────────────────────────────────────────
const audioPlayer = useAudioPlayer()
const library     = useLibrary()
const swipeVerticalGesture = useSwipeVerticallyGesture()

// ── State ───────────────────────────────────────────────────────────
type BottomDrawerState = "closed" | "semi-open" | "open"
const pageTranslate        = computed(() => playerSectionState.value === "open" ? "-50%" : "0%")
const pageTranslateOffset  = ref(0)
const pageTranslateOffsetCss = computed(() => `${pageTranslateOffset.value}px`)
const mainSectionShrinkSize = ref(0)
const playerSectionRef     = ref<InstanceType<typeof IonContent>>()
const playerSectionState   = ref<BottomDrawerState>("closed")
const playerSectionGesture = ref<ReturnType<typeof createGesture>>()
const playerSectionGesture2 = ref<ReturnType<typeof createGesture>>()
const currentTrack  = ref<Track>()
const percentPlayed = computed(() => audioPlayer.state.value.position / audioPlayer.state.value.duration * 100)
const animation = ref("0.5s")
const playerSectionHeight = computed(() => 75);


watch(playerSectionState, async (value) => {
  if (value === 'closed') {
    await NavigationBar.setColor({ color: '#ffffff', darkButtons: true })
  } else {
    await NavigationBar.setColor({ color: "#1D263B", darkButtons: false  })
  }
});

// ── Hooks ───────────────────────────────────────────────────────────
//@ts-ignore
watch(() => playerSectionRef.value?.handleTopRef?.$el, (value) => {
  playerSectionGesture.value = swipeVerticalGesture.create({
    el: value,
    onStart: ev => {
      animation.value = "0.05s";
      ev.data = playerSectionState.value;
    },
    onEnd: ev => {
      animation.value = "0.5s";
      if (ev.data === "open" && ev.deltaY > 10) {
        playerSectionState.value = "semi-open"
        mainSectionShrinkSize.value = playerSectionHeight.value
      } else if (ev.data === "semi-open" && ev.deltaY > 10) {
        playerSectionState.value = "closed";
        audioPlayer.stop()
      } else if (pageTranslateOffset.value < -100) {
        playerSectionState.value = "open"
      }
      pageTranslateOffset.value = 0
    },
    onMove: ev => {
      pageTranslateOffset.value = Math.min(0, ev.deltaY)
      if (ev.deltaY > 0) {
        mainSectionShrinkSize.value = Math.max(0, playerSectionHeight.value - ev.deltaY)
      }
    }
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
    onMove: ev => { pageTranslateOffset.value = ev.deltaY; animation.value = "0.1s"; }
  });
})

onUnmounted(() => {
  playerSectionGesture.value?.destroy()
  playerSectionGesture2.value?.destroy()
})

watch(() => audioPlayer.state.value.trackId, async (value) => {
  playerSectionState.value = value ? "semi-open" : "closed";
  mainSectionShrinkSize.value = value ? playerSectionHeight.value : 0;
  if (!value) return;
  currentTrack.value = await library.tracks.getLecture(value || "")
}, { immediate: true })
</script>

<style scoped>
.page {
  transition: all v-bind(animation);
  transform: translateY(calc(v-bind(pageTranslate) + v-bind(pageTranslateOffsetCss)));
  background-color: var(--ion-color-medium);
  height: 200%;
}
</style>
