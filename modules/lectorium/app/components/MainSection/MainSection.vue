<template>
  <IonContent class="MainSection">
    <IonRouterOutlet />
    <TabsBar class="tabs"/>
  </IonContent>
</template>


<script setup lang="ts">
import { IonRouterOutlet, IonContent } from '@ionic/vue'
import TabsBar from './TabsBar.vue'
import { computed, toRefs } from 'vue';

// ── Interface ───────────────────────────────────────────────────────
const props = defineProps<{
  shrinkSize: number
}>()

// ── State ───────────────────────────────────────────────────────────
const { shrinkSize } = toRefs(props)
const styleShrinkSize = computed(() => `${shrinkSize.value}px`)
const styleBottomRadius = computed(() => shrinkSize.value > 0 ? "5px" : "0px")
</script>


<style scoped>
.MainSection {
  overflow: hidden;
  transition: flex 0.5s;

  flex: 0 0 calc(50% - v-bind(styleShrinkSize));
  border-bottom-left-radius: v-bind(styleBottomRadius);
  border-bottom-right-radius: v-bind(styleBottomRadius);
  box-shadow: 0px 2px 4px var(--ion-color-medium-shade);
}

.tabs {
  padding-bottom: var(--safe-area-bottom, 0px);
}
</style>
