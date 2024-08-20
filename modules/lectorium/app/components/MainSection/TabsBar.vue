<template>
  <IonTabBar>
    <IonTabButton tab="playlist" href="/app/playlist">
      <IonIcon aria-hidden="true" :icon="homeOutline" />
      <IonLabel>{{ $t('home') }}</IonLabel>
    </IonTabButton>

    <IonTabButton tab="library" href="/app/library">
      <IonIcon aria-hidden="true" :icon="libraryOutline" />
      <IonLabel>{{ $t('library') }}</IonLabel>
    </IonTabButton>

    <!-- <IonTabButton tab="settings" href="/app/settings">
      <IonIcon aria-hidden="true" :icon="settingsOutline" />
      <IonLabel>{{ $t('settings') }}</IonLabel>
    </IonTabButton> -->
  </IonTabBar>
</template>


<script setup lang="ts">
import { IonTabBar, IonTabButton, IonLabel, IonIcon } from '@ionic/vue'
import { homeOutline, settingsOutline, libraryOutline } from 'ionicons/icons'
</script>
