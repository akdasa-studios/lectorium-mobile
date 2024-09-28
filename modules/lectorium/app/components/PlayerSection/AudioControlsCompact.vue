<template>
  <div class="trackControls">
    <div class="trackInfo">
      <div class="trackTitle">{{ title }}</div>
      <div>{{ author }}</div>
    </div>
    <div class="buttons">
      <PlayButton
        v-if="!loading"
        :playing="playing"
        @click.stop="emit('playClicked')"
      />
      <IonSpinner class="spinner" v-else />
    </div>
  </div>
</template>


<script setup lang="ts">
import { IonSpinner } from '@ionic/vue'
import PlayButton from './PlayButton.vue'

defineProps<{
  title: string,
  author: string,
  playing: boolean,
  loading: boolean,
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

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.trackTitle {
  font-weight: bold;
  color: var(--ion-color-oxford-blue-contrast);
  overflow: hidden;
  text-overflow: ellipsis;
}

.buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  justify-items: center;
}

.spinner {
  min-width: 32px;
  min-height: 32px;
  margin: 4px;
}
</style>