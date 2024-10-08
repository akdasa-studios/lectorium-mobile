<template>
  <div class="PlayerSection">
    <AudioControlsCompact
      ref="audioControlsCompactRef"
      :title="title || ''"
      :author="author || ''"
      :playing="playing"
      :loading="false"
      @playClicked="emit('playClicked')"
    />

    <CloseHandle
      ref="closeRef"
      class="closeHandle"
    />

    <IonContent
      class="ion-padding prompterContent"
      color="oxford-blue"
    >
      <Prompter
        :blocks="transcript?.text?.blocks || []"
        :time="position"
        @rewind="pos => emit('rewind', pos)"
      />
    </IonContent>
  </div>
</template>


<script setup lang="ts">
import { computed, ref, toRefs } from 'vue'
import { IonContent } from '@ionic/vue'
import { TrackTranscript } from '@core/models'
import AudioControlsCompact from './AudioControlsCompact.vue'
import Prompter from './Prompter.vue'
import CloseHandle from './CloseHandle.vue'

// ── State ───────────────────────────────────────────────────────────
const percentPlayedStyle = computed(() => `${props.percentPlayed + 2}%`)
const audioControlsCompactRef = ref()
const closeRef = ref()

// ── Interface ───────────────────────────────────────────────────────
const props = defineProps<{
  playing: boolean
  loading: boolean
  percentPlayed: number
  position: number
  author: string
  title: string
  transcript: TrackTranscript | undefined
}>()

defineExpose({
  handleTopRef: audioControlsCompactRef,
  handleBottomRef: closeRef
})

const emit = defineEmits<{
  playClicked: [],
  rewind: [position: number],
}>()

const { transcript } = toRefs(props)
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
  margin-top: 10px;
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

.closeHandle {
  margin: 1rem;
}

.prompterContent {
  height: calc(100vh - 16px - 16px - 1rem);
  /* height: calc(100% - 64px - 54px); */
  /* height: calc(100% - 65px - 21px - 10px); */
  /* 1rem + var(--safe-area-top) - var(--safe-area-status-bar-height)); */
}
</style>
