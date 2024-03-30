<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton />
        </IonButtons>
        <IonTitle>{{ title }}</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent>
      <slot />
    </IonContent>
  </IonPage>
</template>


<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton 
} from '@ionic/vue'

const props = defineProps<{
  title: string
}>()
</script>

