<template>
  <IonModal
    :isOpen="open"
    @didDismiss="onClose"
  >
    <Header>
      <IonToolbar>
        <IonTitle>{{ title }}</IonTitle>

        <IonButtons slot="end">
          <IonButton
            @click="onSelect"
            color="light"
            shape="round"
            fill="solid"
          >
            <IonIcon slot="end" :icon="checkmarkCircleOutline" />
            {{ $t('apply') }}
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </Header>

    <IonContent>
      <slot />
    </IonContent>
  </IonModal>
</template>


<script setup lang="ts">
import {
  IonModal, IonContent, IonToolbar, IonButtons,
  IonButton, IonTitle, IonIcon
} from '@ionic/vue'
import { Header } from '@lectorium/shared/components'
import { checkmarkCircleOutline } from 'ionicons/icons'

// ── Interface ───────────────────────────────────────────────────────
defineProps<{
  open: boolean
  title: string
}>()

// const open = defineModel('open', { type: Boolean, default: false })

const emit = defineEmits<{
  close: [],
  select: []
}>()

// ── Handlers ────────────────────────────────────────────────────────
function onSelect() {
  emit('select')
  emit('close')
  // open.value = false
}

function onClose() {
  emit('close')
  // open.value = false
}
</script>
