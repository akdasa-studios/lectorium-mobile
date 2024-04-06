<template>
  <div class="LecturePlayer">
    <div class="Header">
    </div>

    <div class="Waveform">
      <div class="chart">
        <div id="waveform" /> 
      </div>
    </div>

    <div class="Player">
      <PlayBackwardButton
        @click="onPlayBackwardButtonClicked"
      />
      <PlayButton 
        :playing="isPlaying"
        @click="onPlayButtonClicked"
      />
      <PlayForwardButton
        @click="onPlayForwardButtonClicked"
      />
    </div>
  </div>
</template>


<script setup lang="ts">
import { onMounted, watch, toRefs, ref } from 'vue'
import PlayButton from './PlayButton.vue'
import PlayForwardButton from './PlayForwardButton.vue'
import PlayBackwardButton from './PlayBackwardButton.vue'
import WaveSurfer from 'wavesurfer.js'

// ── Interface ───────────────────────────────────────────────────────
const props = defineProps<{
  url: string
}>()

// ── State ───────────────────────────────────────────────────────────
let wavesurfer = undefined
const isPlaying = ref(false)

// ── Hooks ───────────────────────────────────────────────────────────
onMounted(onMounted)

// ── Handlers ────────────────────────────────────────────────────────
function onMounted() {
  setTimeout(async () => {
    const data = await fetch("http://localhost:8080/1.json");
    const json = await data.json();

    wavesurfer = WaveSurfer.create({
      container: '#waveform',
      height: 70,
      waveColor: '#4F4A85',
      progressColor: '#383351',
      url: props.url,
      barWidth: 2,
      barRadius: 2,
      barGap: 2,
      cursorWidth: 0,
      peaks: json.data
    })
    wavesurfer.on('finish', () => {
      isPlaying.value = false
    })
  }, 20)
}

function onPlayButtonClicked() {
  isPlaying.value = !isPlaying.value
  if (isPlaying.value) {
    wavesurfer.play()
  } else {
    wavesurfer.pause()
  }
}

function onPlayBackwardButtonClicked() {
  wavesurfer.setTime(wavesurfer.getCurrentTime() - 15)
}

function onPlayForwardButtonClicked() {
  wavesurfer.setTime(wavesurfer.getCurrentTime() + 15)
}
</script>


<style scoped>
.LecturePlayer {
  display: flex;
  flex-direction: column;
}

.Header {
  flex-grow: 1;
}

.Player {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3em;
  margin: 2em;
}

.Waveform {
  display: flex;
  justify-content: center;
  align-items: center;
}

.chart {
  width: 90%;
}
</style>
