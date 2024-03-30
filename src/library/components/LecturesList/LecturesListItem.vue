<template>
  <IonItem @click="onItemClicked">
    <IonLabel>{{ props.title }}</IonLabel>
  </IonItem>
</template>


<script setup lang="ts">
import { IonItem, IonLabel } from '@ionic/vue'

// ── Interface ───────────────────────────────────────────────────────

const props = defineProps<{
  title: string;
}>()

const emit = defineEmits<{
  click: void;
}>()


// ── Handlers ────────────────────────────────────────────────────────

function onItemClicked() {
  emit('click')
}
</script>

