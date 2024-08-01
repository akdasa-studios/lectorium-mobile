<template>
  <PageWithHeader
    title="Library"
    :loading="false"
    :headerBorder="false"
  >
    <template #header>
      <Searchbar v-model="searchQuery" />
    </template>

    <TracksSearchResult
      :searchQuery="searchQuery"
      @click="onSearchResultItemClicked"
    />
  </PageWithHeader>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import { PageWithHeader } from '@lectorium/shared/components'
import Searchbar from '@lectorium/shared/components/Searchbar/Searchbar.vue'
import { TracksSearchResult, useUserData } from '@lectorium/playlist'
import { useLibrary } from '@lectorium/library'

// ── Dependencies ────────────────────────────────────────────────────
const userData = useUserData()
const library = useLibrary()

// ── State ───────────────────────────────────────────────────────────
const searchQuery = ref('')

// ── Handlers ────────────────────────────────────────────────────────
async function onSearchResultItemClicked(trackId: string) {
  const track = await library.tracks.get(trackId)
  if (!track) return

  function get_url_extension(url: string) {
    // @ts-ignore
    return url.split(/[#?]/)[0].split('.').pop().trim()
  }

  await userData.playlistItems.service.addTrack(trackId)
  await userData.media.service.queueDownload(
    track.url, "tracks/" + track.id +  "." + get_url_extension(track.url))
}
</script>

