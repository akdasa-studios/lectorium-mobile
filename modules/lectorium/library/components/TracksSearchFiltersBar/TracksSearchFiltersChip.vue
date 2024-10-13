<template>
  <IonChip
    :color="color"
    @click="emit('click')"
  >
    <slot></slot>
    <IonIcon
      :icon="icon"
      @click.stop="applied ? emit('remove') : emit('click')"
    />
  </IonChip>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IonChip, IonIcon } from '@ionic/vue'
import { close, chevronDownOutline } from 'ionicons/icons'

// ── Interface ───────────────────────────────────────────────────────
const { applied = false } = defineProps<{
  applied?: boolean
}>()

const emit = defineEmits<{
  click: []
  remove: []
}>()

// ── State ───────────────────────────────────────────────────────────
const icon  = computed(() => applied ? close : chevronDownOutline)
const color = computed(() => applied ? 'primary' : 'medium')
</script>
