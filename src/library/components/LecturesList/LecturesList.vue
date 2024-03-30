<template>
  <IonList>
    <LecturesListItem 
      v-for="lecture in lectures" 
      :key="lecture.id" 
      :title="lecture.title"
      @click="onLectureClicked(lecture.id)"
    />
  </IonList>
</template>


<script setup lang="ts">
import { IonList } from '@ionic/vue'
import LecturesListItem from './LecturesListItem.vue'
import LectureViewModel from './LectureViewModel.ts'

// ── Interface ───────────────────────────────────────────────────────
const props = defineProps<{
  lectures: LectureViewModel[]
}>()

const emit = defineEmits<{
  click: (lectureId: string) => void;
}>()


// ── Handlers ────────────────────────────────────────────────────────
function onLectureClicked(lectureId: string) {
  emit('click', lectureId)
}
</script>

