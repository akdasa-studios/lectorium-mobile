<template>
  <Header>
    <IonToolbar>
      <IonTitle>Create collection</IonTitle>
      <IonButtons slot="primary">
        <IonButton @click="emit('save')">
          <IonIcon
            v-if="isAndroid"
            :icon="checkmarkCircleOutline"
            slot="icon-only"
            color="success"
          />
          <template v-else>Save</template>
        </IonButton>
      </IonButtons>

      <IonButtons slot="secondary">
        <IonButton @click="emit('close')">
          <IonIcon
            v-if="isAndroid"
            :icon="closeCircleOutline"
            slot="icon-only"
            color="danger"
          />
          <template v-else>Close</template>
        </IonButton>
      </IonButtons>
    </IonToolbar>
  </Header>
</template>


<script setup lang="ts">
import { IonIcon, IonToolbar, IonTitle, IonButtons, IonButton, isPlatform, } from '@ionic/vue'
import { Header } from '@lectorium/shared/components'
import { checkmarkCircleOutline, closeCircleOutline } from 'ionicons/icons'

// ── Interface ───────────────────────────────────────────────────────
const emit = defineEmits<{
  save: [],
  close: [],
}>()

// ── State ───────────────────────────────────────────────────────────
const isAndroid = isPlatform('android')
</script>
