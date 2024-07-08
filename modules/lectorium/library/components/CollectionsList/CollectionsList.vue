<template>
  <swiper-container
    :slides-per-view="3.1"
    :space-between="-10"
    ref="swiper"
  >
    <SwiperSlide>
      <CollectionsCardAll />
    </SwiperSlide>

    <SwiperSlide
      v-for="item in items"
      @click="onClick(item.id)"
    >
      <CollectionsCard
        :title="item.title"
        :cover="item.cover"
      />
    </SwiperSlide>

    <SwiperSlide>
      <CollectionsCardAdd
        @click="emit('add')"
      />
    </SwiperSlide>
  </swiper-container>
</template>


<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import CollectionsCard from './CollectionsCard.vue'
import CollectionsCardAll from './CollectionsCardAll.vue'
import CollectionsCardAdd from './CollectionsCardAdd.vue'
import { ref, toRefs, watch } from 'vue'

// ── Interface ───────────────────────────────────────────────────────
export type Collection = {
  id: string,
  title: string,
  cover: string
}

const props = defineProps<{
  items: Collection[]
}>()

const emit = defineEmits<{
  click: [value: string]
  add: []
}>()

// ── State ───────────────────────────────────────────────────────────
const { items } = toRefs(props)
const swiper = ref<{ swiper: typeof Swiper }>()

// ── Hooks ───────────────────────────────────────────────────────────
watch(items, onItemsChanged, { flush: 'post' })

// ── Handlers ────────────────────────────────────────────────────────
function onClick(value: string) {
  console.log(value)
}

function onItemsChanged() {
  swiper.value?.swiper.update()
}
</script>