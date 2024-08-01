<template>
  <MediaList
    :items="items"
  />
</template>


<script setup lang="ts">
import { useUserData } from '@lectorium/playlist';
import { MediaItemViewModel, MediaList } from '@lectorium/settings'
import { useAsyncState } from '@vueuse/core'
import { watch } from 'vue';

// ── Interface ───────────────────────────────────────────────────────
const userData = useUserData()

// ── State ───────────────────────────────────────────────────────────
const { state: items, execute: refresh } = useAsyncState<MediaItemViewModel[]>(async () => {
  const mediaItems = await userData.media.service.getAll()
  return mediaItems.map((item) => ({
    title: item.url,
    size: item.error || "0" ,
    status: item.state,
  }))
}, [], { resetOnExecute: false })

// ── Handlers ────────────────────────────────────────────────────────
watch(userData.media.changedAt, async () => {
  await refresh()
})
</script>