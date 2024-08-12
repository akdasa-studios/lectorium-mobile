<template>
  <IonPage
    class="page"
  >
    <slot name="header"></slot>

    <IonContent
      ref="topDrawerRef"
    >
      <Drawer :open="isDrawerOpen">
        <slot name="drawer"></slot>
      </Drawer>

      <slot></slot>
    </IonContent>
  </IonPage>
</template>


<script setup lang="ts">
import { IonPage, IonContent, createGesture, GestureDetail, ScrollDetail } from '@ionic/vue'
import { onMounted, onUnmounted, ref, toRefs } from 'vue'
import { Drawer } from '@lectorium/shared/components'

// ── Interface ───────────────────────────────────────────────────────
const props = defineProps<{
  canOpenDrawer: boolean,
}>()

defineExpose({
  scrollToTop() {
    topDrawerRef.value?.$el.scrollToTop(500)
  },
  scrollY
})

// ── State ───────────────────────────────────────────────────────────
const topDrawerRef = ref<InstanceType<typeof IonContent>>()
const isDrawerOpen = defineModel("isDrawerOpen", { type: Boolean, default: false })
const { canOpenDrawer } = toRefs(props)
const openDrawerGesture = ref<ReturnType<typeof createGesture>>()

// ── Hooks ───────────────────────────────────────────────────────────
onMounted(() => {
  openDrawerGesture.value = createGesture({
    el: topDrawerRef.value?.$el,
    gestureName: 'my-gesture',
    gesturePriority: 31,
    direction: 'y',
    onMove: ev => onMoveHandler(ev)
  });

  openDrawerGesture.value.enable();
})

onUnmounted(() => {
  openDrawerGesture.value?.destroy()
})

// ── Handlers ────────────────────────────────────────────────────────
function onMoveHandler(ev: GestureDetail): boolean | void {
  if (ev.velocityY > 0 && !isDrawerOpen.value && canOpenDrawer.value) {
    isDrawerOpen.value = true
  } else if (ev.velocityY < 0) {
    isDrawerOpen.value = false
  }
}
</script>
