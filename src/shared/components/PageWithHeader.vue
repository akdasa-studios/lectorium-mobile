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
      <slot v-if="!loading"/>
      <div v-else>Loading...</div>
    </IonContent>
  </IonPage>
</template>


<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton 
} from '@ionic/vue'

defineProps<{
  title: string
  loading: boolean
}>()
</script>

