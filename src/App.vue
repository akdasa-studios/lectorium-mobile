<template>
  <ion-app>
    <ion-router-outlet />
    <GlobalAudioPlayer />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue'
import { GlobalAudioPlayer } from '@/shared/components'
</script>
