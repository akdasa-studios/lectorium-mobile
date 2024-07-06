<template>
  <IonContent class="MainSection">
    <IonRouterOutlet />
    <TabsBar />
  </IonContent>
</template>


<script setup lang="ts">
import { IonRouterOutlet, IonContent } from '@ionic/vue'
import TabsBar from './TabsBar.vue'
import { computed, toRefs } from 'vue';

// ── Interface ───────────────────────────────────────────────────────
const props = defineProps<{
  shrink: boolean
}>()

// ── State ───────────────────────────────────────────────────────────
const { shrink } = toRefs(props)
const topSectionShrink = computed(() => shrink.value ? "75px" : "0px")
const topSectionRadius = computed(() => shrink.value ? "5px" : "0px")
</script>


<style scoped>
.MainSection {
  overflow: hidden;
  transition: flex 0.5s;

  flex: 0 0 calc(50% - v-bind(topSectionShrink));
  border-bottom-left-radius: v-bind(topSectionRadius);
  border-bottom-right-radius: v-bind(topSectionRadius);
  box-shadow: 0px 2px 4px var(--ion-color-medium-shade);
}
</style>
