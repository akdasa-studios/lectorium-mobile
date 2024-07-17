<template>
  <CollectionsList
    :items="collections"
    @add="emit('add')"
  />
</template>


<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { CollectionsList  } from '@lectorium/library/components'
import { useUserData } from '@lectorium/library'
import { watch } from 'vue';

// ── Interface ───────────────────────────────────────────────────────
const emit = defineEmits<{
  add: []
}>()

// ── Dependencies ────────────────────────────────────────────────────
const userData = useUserData()

// ── State ───────────────────────────────────────────────────────────
const { state: collections, execute: refresh } = useAsyncState(
  async () => await userData.collections.service.getAll(), [],
)

// ── Hooks ───────────────────────────────────────────────────────────
watch(userData.collections.changedAt, async () => {
  await refresh()
})
</script>
