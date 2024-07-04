<template>
  <IonHeader
    :class="{
      'Header': true,
      'ion-no-border': isAndroid
    }"
  >
    <slot></slot>
  </IonHeader>
</template>

<script setup lang="ts">
import { IonHeader, isPlatform } from '@ionic/vue'

const isAndroid = isPlatform('android')
</script>
