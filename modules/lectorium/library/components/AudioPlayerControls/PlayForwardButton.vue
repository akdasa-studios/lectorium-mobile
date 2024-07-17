<template>
  <IonIcon class="PlayForwardButton" :icon="playForwardOutline" />
</template>


<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import { playForwardOutline } from 'ionicons/icons'
</script>


<style scoped>
.PlayForwardButton {
  min-width: 25px;
  min-height: 25px;
}
</style>

