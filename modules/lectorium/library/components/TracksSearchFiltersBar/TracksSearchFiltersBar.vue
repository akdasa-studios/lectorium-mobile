<template>
  <div class="chip-list-container">
    <TracksSearchFiltersChip
      v-for="filter in filters"
      :key="filter.id"
      :applied="filter.applied"
      @click="emit('click', filter.id)"
      @remove="emit('remove', filter.id)"
      class="chip-list-item"
    >
      {{ filter.title }}
    </TracksSearchFiltersChip>
  </div>
</template>

<script setup lang="ts">
import TracksSearchFiltersChip from './TracksSearchFiltersChip.vue'

// ── Interface ───────────────────────────────────────────────────────
type Filter = {
  id: string
  title: string
  applied: boolean
}

const { filters } = defineProps<{
  filters: Filter[]
}>()

const emit = defineEmits<{
  click: [filterId: string]
  remove: [filterId: string]
}>()
</script>

<style scoped>
.chip-list-container {
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;

  -ms-overflow-style: none;
  scrollbar-width: none;
}

.chip-list-container::-webkit-scrollbar {
  display: none;
}

.chip-list-item {
  margin-right: 5px;
  margin-left: 5px;
}
</style>
