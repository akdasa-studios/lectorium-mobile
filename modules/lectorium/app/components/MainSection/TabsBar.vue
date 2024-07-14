<template>
  <IonTabBar class="bar">
    <IonTabButton tab="library" href="/app/library">
      <IonIcon aria-hidden="true" :icon="homeOutline" />
      <IonLabel>Home</IonLabel>
    </IonTabButton>

    <IonTabButton tab="player" href="/app/player">
      <IonIcon aria-hidden="true" :icon="settingsOutline" />
      <IonLabel>Settings</IonLabel>
    </IonTabButton>
  </IonTabBar>
</template>


<script setup lang="ts">
import { IonTabBar, IonTabButton, IonLabel, IonIcon } from '@ionic/vue'
import { homeOutline, settingsOutline } from 'ionicons/icons'
</script>
