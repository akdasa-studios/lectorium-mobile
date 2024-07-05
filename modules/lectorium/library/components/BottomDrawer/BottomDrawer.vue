<template>
  <IonContent
    :scroll-y="false"
    class="parts bottomDrawer"
    color="oxford-blue"
  >
    <slot />
  </IonContent>
</template>


<script setup lang="ts">
import { computed } from 'vue'
import { IonContent } from '@ionic/vue'

const props = defineProps<{
  percent: number
}>()

const percentPlayedStyle = computed(() => `${props.percent + 2}%`)
</script>


<style scoped>
.parts {
  transition: all 1.5s;
  overflow: hidden;
}

.bottomDrawer {
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}

.bottomDrawer::after {
  content: '';
  position: absolute;
  left: -2px;
  top: 0px;
  height: 4px;
  background: var(--ion-color-oxford-blue-tint);
  width: v-bind(percentPlayedStyle);
  display: inline-block;
  border-radius: 5px;
  transition: all 0.5s;
}
</style>