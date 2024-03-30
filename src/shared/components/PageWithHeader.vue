<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>{{ title }}</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent>
      <slot />
    </IonContent>
  </IonPage>
</template>


<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue'

const props = defineProps<{
  title: string
}>()
</script>

