<template>
  <CollectionsList
    :items="collections"
    @add="emit('add')"
  />
</template>


<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { CollectionsList } from '@lectorium/playlist'
import { watch } from 'vue'
import { useUserData } from '@lectorium/shared'

// ── Interface ───────────────────────────────────────────────────────
const emit = defineEmits<{
  add: []
}>()

// ── Dependencies ────────────────────────────────────────────────────
const userData = useUserData()

// ── State ───────────────────────────────────────────────────────────
const { state: collections, execute: refresh } = useAsyncState(
  async () => await userData.collections.getAll(), [],
)

// ── Hooks ───────────────────────────────────────────────────────────
// watch(userData.collections.changedAt, async () => {
//   await refresh()
// })
</script>
