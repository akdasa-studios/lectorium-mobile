<template>
  <MediaList
    :items="items"
  />
</template>


<script setup lang="ts">
import { useUserData } from '@lectorium/shared'
import { MediaItemViewModel, MediaList } from '@lectorium/settings'
import { useAsyncState } from '@vueuse/core'

// ── Interface ───────────────────────────────────────────────────────
const userData = useUserData()

// ── State ───────────────────────────────────────────────────────────
const { state: items, execute: refresh } = useAsyncState<MediaItemViewModel[]>(async () => {
  const mediaItems = await userData.media.getAll()
  return mediaItems.map((item) => ({
    title: item.title,
    size: item.size?.toString() || "0",
    status: item.state,
  }))
}, [], { resetOnExecute: false })

// ── Handlers ────────────────────────────────────────────────────────
// TODO: refresh view once media changed
// watch(userData.media.changedAt, async () => {
//   await refresh()
// })
</script>