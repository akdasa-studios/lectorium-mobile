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

    <IonContent
      :scroll-y="false"
      class="parts bottomDrawer"
      color="oxford-blue"
      ref="bottomDrawerRef"
    >
      <div class="trackControls">
        <div class="trackInfo">
          <div class="trackTitle">Current track</div>
          <div>Author</div>
        </div>
        <div class="trackButtons">
          <PlayButton
            :playing="audioPlayer.playing"
            @click="audioPlayer.togglePlaying()"
          />
        </div>

      </div>

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
        <!-- <span
          v-for="text in currentTrack.text"
          :key="text.start"
          :class="{
            'highlight': text.start <= audioPlayer.position.value *1000 && text.end >= audioPlayer.position.value*1000
          }"
        >
          {{ text.text }}
          <hr v-if="text.newParagraph" />
        </span> -->
      </IonContent>

      <!-- <AudioPlayerControls /> -->
    </IonContent>
  </IonPage>
</template>


<script setup lang="ts">
import { IonPage, IonContent, createGesture, GestureDetail } from '@ionic/vue'
import { onMounted, onUnmounted, ref, computed, watch } from 'vue'
import { Drawer } from '@lectorium/shared/components'
import { useAudioPlayer, usePlaylist } from '@lectorium/shared/composables'
import { AudioPlayerControls } from '@lectorium/player/components'
import { PlayButton } from '@lectorium/player/components'
import { Track } from '@core/models'
import { useLibrary } from '@lectorium/library/composables'
import { Prompter } from '@lectorium/shared/components'

type BottomDrawerState = "closed" | "semi-open" | "open"
const audioPlayer = useAudioPlayer()
const playlist = usePlaylist()

const library = useLibrary()

// ── State ───────────────────────────────────────────────────────────
// const pageRef = ref<InstanceType<typeof IonPage>>()

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


    // offsetTop.value = "0%"
    // offsetBottom.value = "75px"
    // bottomDrawerState.value = "closed"
  } else if (ev.velocityY < 0) {
    isDrawerOpen.value = false
    // console.log(pageRef.value.$el)
    // bottomDrawerState.value = "open"

    // pageRef.value.$el.style.transform = `translateY(-100px)`
    // offsetTop.value = "-50%"
    // offsetBottom.value = "15px"
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
const percentPlayedStyle = computed(() => `${percentPlayed.value+2}%`)
</script>



<style scoped>
.page {
  transition: all 0.5s;
  transform: translateY(v-bind(offsetTop));
  gap: 10px;
  background-color: var(--ion-color-medium);
  /* display: block; */
  /* flex-direction: column; */
  /* height: 100%; */
  height: 200%;
}

.parts {
  transition: all 0.5s;
  overflow: hidden;
}

.topDrawer {
  flex: 0 0 calc(50% - v-bind(offsetBottom));
  border-bottom-left-radius: v-bind(topDrawerBorderRadius);
  border-bottom-right-radius: v-bind(topDrawerBorderRadius);
  box-shadow: 0px 2px 4px var(--ion-color-medium);

  /* height: 75; */

  /* max-height: calc(100% - 50px); */
  /* border-radius: 10px; */
  /* top: 0px; */
}
.bottomDrawer {
  /* box-shadow: 0px -.01px 2px var(--ion-color-medium); */
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  /* margin-top: +25px; */
  /* height: 50%; */
}

.bottomDrawer::after {
  content: '';
  position: absolute;
  left: -2px;
  top: 0px;
  height: 4px;
  background: var(--ion-color-oxford-blue-tint);
  width: v-bind(percentPlayedStyle);
  display: inline-block;
  border-radius: 5px;
  transition: all 0.5s;
}

.trackControls {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 65px;
  padding-left: 1rem;
  padding-right: 1rem;
}

.trackInfo {
  color: var(--ion-color-oxford-blue-contrast);
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  gap: 3px;
  font-size: 0.8rem;
}

.trackTitle {
  font-weight: bold;
  color: var(--ion-color-oxford-blue-contrast);
}

.highlight {
  background: var(--ion-color-oxford-blue-tint);
  border-radius: 5px;
  border: 1px solid var(--ion-color-oxford-blue-tint);
}

.text {
  /* text-align: justify; */
  /* text-justify: inter-word; */
}
</style>