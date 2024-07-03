<template>
  <IonModal
    :isOpen="open"
    @didDismiss="open = false"
  >
    <IonHeader>
      <IonToolbar>
        <IonTitle>Selector</IonTitle>
        <IonButtons slot="end">
          <IonButton>Close</IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>

    <IonContent>
      <IonSearchbar v-model="query" />
      <IonList>
        <slot
          v-for="item in items"
          :key="item.id"
          :item="item"
        ></slot>
      </IonList>
    </IonContent>
  </IonModal>
</template>


<script setup lang="ts" generic="T extends Item">
import {
  IonModal, IonHeader, IonContent, IonList, IonSearchbar,
  IonToolbar, IonButtons, IonButton, IonTitle
} from '@ionic/vue'

// ── Interface ───────────────────────────────────────────────────────
export type Item = {
  id: string
}

defineProps<{
  items: T[]
}>()

const open = defineModel('open', { type: Boolean, default: false })
const query = defineModel('query', { type: String, default: '' })
</script>