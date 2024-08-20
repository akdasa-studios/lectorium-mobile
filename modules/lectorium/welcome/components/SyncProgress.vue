<template>
  <div>
    <div class="header">
      {{ $t('loading-data') }}
    </div>

    <div v-for="step in steps" :key="step.name">
      <div class="row">
        <RadialProgress
          :diameter="16"
          :stroke-width="2"
          :inner-stroke-width="2"
          inner-stroke-color="#d7d8da"
          start-color="#92949c"
          stop-color="#92949c"
          :total-steps="100"
          :completed-steps="step.progress"
        />
        <span>
          {{ step.name }}
        </span>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import RadialProgress from "vue3-radial-progress";

export type SyncStep = {
  name: string
  progress: number
}

defineProps<{
  steps: SyncStep[]
}>()
</script>


<style scoped>
.header {
  font-size: 1.25rem;
  font-weight: bold;
  margin: 1rem;
}

.row {
  display: flex;
  align-items: center;
  gap: 4px;
  margin: .25rem;
}
</style>