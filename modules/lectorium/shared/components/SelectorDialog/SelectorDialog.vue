<template>
  <!--
  TODO: test UI/UX
  :initial-breakpoint=".75"
  :breakpoints="[0, 0.25, 0.5, 0.75, 1]"
  -->
  <IonModal
    :isOpen="open"
    :initial-breakpoint=".75"
    :breakpoints="[0, 0.25, 0.5, 0.75]"
    :backdrop-dismiss="false"
    :backdrop-breakpoint="0.25"
    :handle="true"
    @didDismiss="onClose"
  >
    <Header>
      <IonToolbar>
        <!-- <IonButtons slot="start">
          <IonButton @click="onClose">
            <IonIcon slot="icon-only" :icon="arrowBack" />
          </IonButton>
        </IonButtons> -->

        <IonTitle>{{ title }}</IonTitle>

        <IonButtons slot="end">
          <IonButton
            @click="onSelect"
            color="light"
            shape="round"
            fill="solid"
          >
            <IonIcon slot="end" :icon="checkmarkCircleOutline" />
            {{ $t('save') }}
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
import { arrowBack, checkmarkCircleOutline } from 'ionicons/icons'

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
