<template>
  <IonApp>
    <IonRouterOutlet />
    <GlobalAudioPlayer />
  </IonApp>
</template>


<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue'
import { GlobalAudioPlayer } from '@lectorium/shared/containers'
import { useSync } from '@lectorium/shared'

const sync = useSync()

sync.execute({ trackIds: [] })
</script>
