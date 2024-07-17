<template>
  <IonPage>
    <IonHeader :class="{'ion-no-border': !headerBorder}">
      <!-- <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton />
        </IonButtons>
      </IonToolbar> -->

      <IonToolbar>
        <slot name="header">
          <IonTitle>{{ title }}</IonTitle>
        </slot>
      </IonToolbar>
    </IonHeader>

    <IonContent
      ref="content"
    >
      <IonLoading
        :isOpen="loading"
        :duration="0"
        message="Loading..."
      />
      <slot></slot>
    </IonContent>
  </IonPage>
</template>


<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonLoading,
} from '@ionic/vue'
import { ref } from 'vue'

// ── Interface ───────────────────────────────────────────────────────
withDefaults(defineProps<{
  title: string
  loading: boolean
  headerBorder?: boolean
}>(), {
  headerBorder: true
})

// ── State ───────────────────────────────────────────────────────────
const content = ref<InstanceType<typeof IonContent>>()
</script>

