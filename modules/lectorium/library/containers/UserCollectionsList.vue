<template>
  <CollectionsList
    :items=collections
    @add="emit('add')"
  />
</template>


<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { CollectionsList  } from '@lectorium/library/components'
import { useUserData } from '@lectorium/library'

// ── Emits ───────────────────────────────────────────────────────────
const emit = defineEmits<{
  add: []
}>()

// ── Dependencies ────────────────────────────────────────────────────
const userData = useUserData()

// ── State ───────────────────────────────────────────────────────────
const { state: collections } = useAsyncState(() => userData.collections.getAll(), [])
</script>
