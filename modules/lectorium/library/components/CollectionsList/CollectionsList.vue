<template>
  <swiper-container
    :slides-per-view="3.1"
    :space-between="-10"
  >
    <swiper-slide
      v-for="item in items"
      @click="onClick(item.id)"
    >
      <CollectionsCard
        :title="item.title"
        :cover="item.cover"
      />
    </swiper-slide>

    <swiper-slide>
      <CollectionsCardAdd
        @click="emit('add')"
      />
    </swiper-slide>
  </swiper-container>
</template>


<script setup lang="ts">
import CollectionsCard from './CollectionsCard.vue'
import CollectionsCardAdd from './CollectionsCardAdd.vue'

// ── Interface ───────────────────────────────────────────────────────
export type Collection = {
  id: string,
  title: string,
  cover: string
}

defineProps<{
  items: Collection[]
}>()

const emit = defineEmits<{
  click: [value: string]
  add: []
}>()

// ── Handlers ────────────────────────────────────────────────────────
function onClick(value: string) {
  console.log(value)
}
</script>