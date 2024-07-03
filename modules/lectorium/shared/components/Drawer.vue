<template>
  <div :class="[
    open ? 'open' : 'closed',
    initialized ? 'initialized' : ''
  ]" ref="drawer">
    <slot></slot>
  </div>
</template>


<script setup lang="ts">
import { ref, watch } from 'vue';
import { useElementSize } from '@vueuse/core'

// ── Interface ───────────────────────────────────────────────────────
defineProps<{
  open: boolean
}>()

// ── State ───────────────────────────────────────────────────────────
const drawer = ref<HTMLElement>();
const offsetTop = ref("-0px");
const initialized = ref(false);
const { height } = useElementSize(drawer)

// ── Hooks ───────────────────────────────────────────────────────────
watch(height, (value) => {
  if (!value) return;
  offsetTop.value = `calc(-${value}px - 10px)`;
  setTimeout(() => initialized.value = true, 1)
})
</script>


<style scoped>
.open {
  margin-top: 0px;
}
.closed {
  margin-top: v-bind(offsetTop);
}
.initialized {
  transition: all 0.5s;
}
</style>
