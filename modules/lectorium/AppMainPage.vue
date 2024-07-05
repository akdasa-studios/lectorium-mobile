

<template>
  <IonPage
    class="page"
  >
    <IonContent class="parts topDrawer">
      <IonRouterOutlet></IonRouterOutlet>
      <IonTabBar class="bar">
        <IonTabButton tab="library" href="/app/library">
          <IonIcon aria-hidden="true" :icon="homeOutline" />
          <IonLabel>Home</IonLabel>
        </IonTabButton>

        <IonTabButton tab="player" href="/app/player">
          <IonIcon aria-hidden="true" :icon="settingsOutline" />
          <IonLabel>Settings</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonContent>

    <BottomDrawer
      :percent="percentPlayed"
      ref="bottomSectionRef"
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
import { onMounted, onUnmounted, ref, computed, watch } from 'vue'
import {
  IonPage, IonRouterOutlet, IonContent, IonTabBar, IonTabButton, IonLabel,
  IonIcon, createGesture, GestureDetail
} from '@ionic/vue'
import { homeOutline, settingsOutline } from 'ionicons/icons'
import { Track } from '@core/models'
import { useAudioPlayer, usePlaylist } from '@lectorium/shared/composables'
import { useLibrary } from '@lectorium/library/composables'
import { Prompter } from '@lectorium/shared/components'
import { BottomDrawer, AudioControlsCompact } from '@lectorium/library/components'

// ── Dependencies ────────────────────────────────────────────────────
const audioPlayer = useAudioPlayer()
const playlist = usePlaylist()
const library = useLibrary()

// ── State ───────────────────────────────────────────────────────────
type BottomDrawerState = "closed" | "semi-open" | "open"
const pageTranslate    = computed(() => bottomSectionState.value === "open" ? "-50%" : "0%")
const topSectionShrink = computed(() => bottomSectionState.value.endsWith("open") ? "75px" : "0px")
const topSectionRadius = computed(() => bottomSectionState.value !== "closed" ? "5px" : "0px")
const bottomSectionRef     = ref<InstanceType<typeof IonContent>>()
const bottomSectionState   = ref<BottomDrawerState>("closed")
const bottomSectionGesture = ref<ReturnType<typeof createGesture>>()

const currentTrack  = ref<Track>()
const percentPlayed = computed(() => audioPlayer.position.value / audioPlayer.duration.value * 100)

// ── Hooks ───────────────────────────────────────────────────────────
onMounted(() => {
  bottomSectionGesture.value = createGesture({
    el: bottomSectionRef.value?.$el,
    gestureName: 'open-bottom-section',
    gesturePriority: 31,
    direction: 'y',
    onStart: ev => {
      ev.data = bottomSectionState.value;
      return true;
    },
    onMove: ev => onBottomSectionGestureMove(ev)
  });

  bottomSectionGesture.value.enable();
})

onUnmounted(() => {
  bottomSectionGesture.value?.destroy()
})

watch(playlist.currentTrackId, async (value) => {
  if (!value) return;
  currentTrack.value = await library.tracks.getLecture(value)
}, { immediate: true })

// ── Handlers ────────────────────────────────────────────────────────
function onBottomSectionGestureMove(ev: GestureDetail) {
  if (ev.velocityY > 1) {
    if (ev.data === "open") {
      bottomSectionState.value = "semi-open"
    } else if (ev.data === "semi-open") {
      bottomSectionState.value = "closed";
      audioPlayer.stop();
      playlist.currentTrackId.value = ""
    }
  } else if (ev.velocityY < -1) {
    bottomSectionState.value = "open"
  }
}

watch(playlist.currentTrackId, (value) => {
  if (value) {
    bottomSectionState.value = "semi-open"
  } else {
    bottomSectionState.value = "closed"
  }
}, { immediate: true })
</script>



<style scoped>
.page {
  transition: all 0.5s;
  transform: translateY(v-bind(pageTranslate));
  gap: 10px;
  background-color: var(--ion-color-medium);
  height: 200%;
}

.parts {
  transition: all 1.5s;
  overflow: hidden;
}

.topDrawer {
  flex: 0 0 calc(50% - v-bind(topSectionShrink));
  border-bottom-left-radius: v-bind(topSectionRadius);
  border-bottom-right-radius: v-bind(topSectionRadius);
  box-shadow: 0px 2px 4px var(--ion-color-medium-shade);
}

.bar {
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>