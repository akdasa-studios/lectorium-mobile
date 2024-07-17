<template>
  <IonIcon class="PlayBackwardButton" :icon="playBackOutline" />
</template>


<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import { playBackOutline } from 'ionicons/icons'
</script>


<style scoped>
.PlayBackwardButton {
  min-width: 25px;
  min-height: 25px;
}
</style>

