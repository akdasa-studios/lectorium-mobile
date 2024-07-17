<template>
  <IonPage class="page">
    <slot name="main" :shrink="mainSectionShrinkSize" />
    <slot name="player" />
  </IonPage>
</template>


<script setup lang="ts">
import { onUnmounted, ref, computed, watch, toRefs } from 'vue'
import { Gesture, IonPage } from '@ionic/vue'
import { useAppLayout, useSwipeVerticallyGesture } from '@lectorium/app'
import { useAudioPlayer } from '@lectorium/shared/composables'

// ── Dependencies ────────────────────────────────────────────────────
const swipeVerticalGesture = useSwipeVerticallyGesture()
const audioPlayer = useAudioPlayer()
const appLayout = useAppLayout()

// ── Interface ───────────────────────────────────────────────────────
export type PlayerSectionState = 'open' | 'semi-open' | 'closed'
const props = defineProps<{
  openHandle: any,
  closeHanle: any,
}>()

// ── State ───────────────────────────────────────────────────────────
const { openHandle, closeHanle } = toRefs(props)
const layoutShift = ref(0)
const animation = computed(() => layoutShift.value === 0 ? "0.5s" : "0.1s")
const mainSectionShrinkSize = computed(() =>
  appLayout.layoutState.value === 'semi-open'
    ? 75 - Math.max(0, layoutShift.value)
    : appLayout.layoutState.value === 'open' ? 75 : 0
)
const stylePageTranslate = computed(() =>
  `calc(${appLayout.layoutState.value === "open"
    ? `-50% + ${Math.max(0, layoutShift.value)}px`
    : `0% + ${Math.min(0, layoutShift.value)}px`})`
)
let gestureOpenPlayerSection: Gesture|undefined = undefined
let gestureClosePlayerSection: Gesture|undefined = undefined

// ── Hooks ───────────────────────────────────────────────────────────
watch(openHandle, (value) => {
  if (!value) { return }
  gestureOpenPlayerSection = swipeVerticalGesture.create({
    el: value,
    onEnd(ev) {
      layoutShift.value = 0
      appLayout.layoutState.value =
        (ev.deltaY >=  10)  ? "closed" :
        (ev.deltaY <= -100) ? "open"   : appLayout.layoutState.value;
    },
    onMove(ev) { layoutShift.value = ev.deltaY }
  });
})

watch(closeHanle, (value) => {
  if (!value) { return }
  gestureClosePlayerSection = swipeVerticalGesture.create({
    el: value,
    onEnd(ev) {
      layoutShift.value = 0
      if (ev.deltaY > 10) {
        appLayout.layoutState.value = "semi-open"
      }
    },
    onMove(ev) { layoutShift.value = ev.deltaY }
  });
})

onUnmounted(() => {
  gestureOpenPlayerSection?.destroy()
  gestureClosePlayerSection?.destroy()
})

watch(() => audioPlayer.state.value.trackId, async (value) => {
  appLayout.layoutState.value = value ? "semi-open" : "closed";
  if (!value) return;
}, { immediate: true })
</script>


<style scoped>
.page {
  transition: all v-bind(animation);
  transform: translateY(v-bind(stylePageTranslate));
  background-color: var(--ion-color-medium);
  height: 200%;
}
</style>
