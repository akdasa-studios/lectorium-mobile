<template>
  <PageWithHeader
    title="Library"
    :loading="false"
    :headerBorder="false"
  >
    <template #header>
      <Searchbar
        v-model="searchQuery"
        :placeholder="$t('search-in-library', { count: tracksCount })"
      />
    </template>

    <TracksSearchResult
      :searchQuery="searchQuery"
      @click="onSearchResultItemClicked"
    />
  </PageWithHeader>
</template>


<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { PageWithHeader } from '@lectorium/shared/components'
import { TracksSearchResult } from '@lectorium/playlist'
import { useUserData } from '@lectorium/shared'
import { useLibrary } from '@lectorium/library'
import Searchbar from '@lectorium/shared/components/Searchbar/Searchbar.vue'
import { useLocalStorage } from '@vueuse/core'

// ── Dependencies ────────────────────────────────────────────────────
const userData = useUserData()
const library = useLibrary()

// ── State ───────────────────────────────────────────────────────────
const tracksCount = useLocalStorage('library.tracks.count', 0)
const searchQuery = ref('')

// ── Hooks ───────────────────────────────────────────────────────────
onBeforeMount(async () => {
  tracksCount.value = await library.tracks.getCount()
})

// ── Handlers ────────────────────────────────────────────────────────
async function onSearchResultItemClicked(trackId: string) {
  await userData.playlist.addTrack(trackId)
}
</script>
