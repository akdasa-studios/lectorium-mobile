<template>
  <IonApp>
    <IonRouterOutlet />
    <GlobalAudioPlayer />
  </IonApp>
</template>


<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue'
import { GlobalAudioPlayer } from '@/shared/containers'
</script>
