<template>
  <SelectorDialog
    v-model:open="open"
    title="Languages"
    :items="items"
    @select="onSelect"
  />
</template>


<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { SelectorDialog } from '@lectorium/shared/components'
import { useLibrary } from '@lectorium/library/composables'
import { Language } from '@core/models'

// ── Dependencies ────────────────────────────────────────────────────
const library = useLibrary()

// ── Interface ───────────────────────────────────────────────────────
const open = defineModel('open', { type: Boolean, default: false, })

const emit = defineEmits<{
  select: [ids: string[]]
}>()

// ── State ───────────────────────────────────────────────────────────
const { state: items } = useAsyncState(
  async () => map2(await library.languages.getAll()), [])

// ── Handlers ────────────────────────────────────────────────────────
function onSelect(ids: string[]) {
  emit('select', ids)
}

// ── Helpers ─────────────────────────────────────────────────────────
function map2(languages: Language[]) {
  return languages.map((language) => ({
    id: language.code,
    title: language.name,
    checked: false,
  }))
}
</script>
