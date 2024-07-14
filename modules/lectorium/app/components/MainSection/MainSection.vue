<template>
  <IonContent class="MainSection">
    <IonRouterOutlet />
  </IonContent>
  <TabsBar
    class="tabs closed"
    ref="tabsRef"
  />
</template>


<script setup lang="ts">
import { computed, ref, toRefs } from 'vue'
import { IonRouterOutlet, IonContent } from '@ionic/vue'
import { useElementSize } from '@vueuse/core'
import { useSafeArea } from '@lectorium/app'
import TabsBar from './TabsBar.vue'

// ── Interface ───────────────────────────────────────────────────────
const props = defineProps<{
  shrinkSize: number
}>()

// ── Dependencies ────────────────────────────────────────────────────
const tabsRef = ref()
const { height } = useElementSize(tabsRef)
const safeArea = useSafeArea()

// ── State ───────────────────────────────────────────────────────────
const { shrinkSize } = toRefs(props)
const styleShrinkSize = computed(() => `${shrinkSize.value+height.value}px`)
const styleBottomRadius = computed(() => shrinkSize.value > 0 ? "5px" : "0px")
</script>


<style scoped>
.MainSection {
  overflow: hidden;
  transition: flex 0.5s;
  flex: 0 0 calc(50% - v-bind(styleShrinkSize));
}

.tabs {
  transition: padding 0.5s;
  border-bottom-left-radius: v-bind(styleBottomRadius);
  border-bottom-right-radius: v-bind(styleBottomRadius);
  /* box-shadow: 0px 2px 4px var(--ion-color-medium-shade); */

}
</style>
