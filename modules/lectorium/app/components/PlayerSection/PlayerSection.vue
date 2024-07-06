<template>
  <div class="PlayerSection">
    <AudioControlsCompact
      v-if="track"
      :title="track.title"
      :author="'Author'"
      :playing="playing"
      @playClicked="emit('playClicked')"
    />

    <IonContent
      class="ion-padding"
      color="oxford-blue"
      v-if="track"
    >
      <Prompter
        :text="track.text"
        :time="position"
        @rewind="pos => emit('rewind', pos)"
      />
    </IonContent>
  </div>
</template>


<script setup lang="ts">
import { computed } from 'vue'
import { IonContent } from '@ionic/vue'
import { Track } from '@core/models'
import AudioControlsCompact from './AudioControlsCompact.vue'
import Prompter from './Prompter.vue'

// ── Interface ───────────────────────────────────────────────────────
const props = defineProps<{
  playing: boolean
  percentPlayed: number
  position: number
  track: Track | undefined
}>()

const emit = defineEmits<{
  playClicked: [],
  rewind: [position: number],
}>()

// ── State ───────────────────────────────────────────────────────────
const percentPlayedStyle = computed(() => `${props.percentPlayed + 2}%`)
</script>


<style scoped>
.PlayerSection {
  flex: 1 1 0%;
  background-color: var(--ion-color-oxford-blue);
  color: var(--ion-color-oxford-blue-contrast);
  overflow: hidden;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  position: relative;
}

.PlayerSection::after {
  content: '';
  position: absolute;
  left: -2px;
  top: 0px;
  height: 4px;
  background: var(--ion-color-oxford-blue-tint);
  width: v-bind(percentPlayedStyle);
  border-radius: 5px;
  transition: all 0.5s;
}
</style>
