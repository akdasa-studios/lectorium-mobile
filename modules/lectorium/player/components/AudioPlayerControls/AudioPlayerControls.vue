<template>
  <!-- <div class="LecturePlayer">
    <div class="Header">
    </div>

    <div class="Waveform">
      <div class="chart">
        {{ position }}
      </div>
    </div> -->

    <div class="Player">
      <PlayBackwardButton
        @click="onPlayBackwardButtonClicked"
      />
      <PlayButton
        :playing="playing"
        @click="onPlayButtonClicked"
      />
      <PlayForwardButton
        @click="onPlayForwardButtonClicked"
      />
    </div>
  <!-- </div> -->
</template>


<script setup lang="ts">
import PlayButton from './PlayButton.vue'
import PlayForwardButton from './PlayForwardButton.vue'
import PlayBackwardButton from './PlayBackwardButton.vue'

// ── Interface ───────────────────────────────────────────────────────
const playing = defineModel('playing', { type: Boolean, default: false })
const position = defineModel('position', { type: Number, default: 0 })

// ── Handlers ────────────────────────────────────────────────────────
function onPlayButtonClicked() {
  playing.value = !playing.value
}

function onPlayBackwardButtonClicked() {
  position.value -= 10;
}

function onPlayForwardButtonClicked() {
  position.value += 10;
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
  margin: .5em;
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
