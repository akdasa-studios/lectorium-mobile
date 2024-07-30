<template>
  <SelectorDialog
    v-model:open="open"
    title="Sources"
    :items="items"
    @select="onSelect"
  />
</template>


<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { SelectorDialog } from '@lectorium/shared/components'
import { useLibrary } from '@lectorium/library'
import { Source } from '@core/models'

// ── Dependencies ────────────────────────────────────────────────────
const library = useLibrary()

// ── Interface ───────────────────────────────────────────────────────
const open = defineModel('open', { type: Boolean, default: false, })

const emit = defineEmits<{
  select: [ids: string[]]
}>()

// ── State ───────────────────────────────────────────────────────────
const { state: items } = useAsyncState(
  async () => map2(await library.sources.getAll()), [])

// ── Handlers ────────────────────────────────────────────────────────
function onSelect(ids: string[]) {
  emit('select', ids)
}

// ── Helpers ─────────────────────────────────────────────────────────
function map2(sources: Source[]) {
  return sources.map((source) => ({
    id: source.id,
    title: source.name['ru'].short,
    checked: false,
  }))
}
</script>
