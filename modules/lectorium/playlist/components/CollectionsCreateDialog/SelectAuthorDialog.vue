<template>
  <SelectorDialog
    v-model:open="open"
    title="Authors"
    :items="items"
    @select="onSelect"
  />
</template>


<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { SelectorDialog } from '@lectorium/shared/components'
import { useLibrary } from '@lectorium/library'
import { Author } from '@core/models'

// ── Dependencies ────────────────────────────────────────────────────
const library = useLibrary()

// ── Interface ───────────────────────────────────────────────────────
const open = defineModel('open', { type: Boolean, default: false, })

const emit = defineEmits<{
  select: [item: string[]]
}>()

// ── State ───────────────────────────────────────────────────────────
const { state: items } = useAsyncState(
  async () => map2(await library.authors.getAll()), [])

// ── Handlers ────────────────────────────────────────────────────────
function onSelect(ids: string[]) {
  emit('select', ids)
}

// ── Helpers ─────────────────────────────────────────────────────────
function map2(authors: Author[]) {
  return authors.map((author) => ({
    id: author._id,
    // TODO: Get author name using app language
    //       https://github.com/akdasa-studios/lectorium-mobile/issues/35
    title: author.getName('ru','full'),
    checked: false,
  }))
}
</script>
