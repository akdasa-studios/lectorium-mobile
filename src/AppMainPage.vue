<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="library" href="/app/library">
          <ion-icon aria-hidden="true" :icon="homeOutline" />
          <ion-label>Home</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="player" href="/app/player">
          <ion-icon aria-hidden="true" :icon="playOutline" />
          <ion-label>Player</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon,
  IonPage, IonRouterOutlet
} from '@ionic/vue'
import { homeOutline, playOutline } from 'ionicons/icons'
</script>
