<template>
  <div class="trackControls">
    <div class="trackInfo">
      <div class="trackTitle">{{ title }}</div>
      <div>{{ author }}</div>
    </div>
    <div>
      <PlayButton
        :playing="playing"
        @click="emit('playClicked')"
      />
    </div>
  </div>
</template>


<script setup lang="ts">
import PlayButton from './PlayButton.vue'

defineProps<{
  title: string,
  author: string,
  playing: boolean
}>()

const emit = defineEmits<{
  playClicked: []
}>()
</script>


<style scoped>
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
</style>