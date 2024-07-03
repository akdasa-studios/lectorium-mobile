<template>
  <CollectionsCardBase class="CollectionsCardAdd">
    <IonIcon
      :icon="addCircleOutline"
      color="primary"
      size="large" />
  </CollectionsCardBase>
</template>


<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import { addCircleOutline } from 'ionicons/icons'
import CollectionsCardBase from './CollectionsCardBase.vue'
</script>


<style scoped>
.CollectionsCardAdd {
  border: 2px dashed var(--ion-color-primary);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>