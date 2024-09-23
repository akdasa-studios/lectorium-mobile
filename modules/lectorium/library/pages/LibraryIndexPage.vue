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

    <!-- List of a filters: author, source, location ... -->
    <SearchFilters
      v-model="filters"
    />

    <!-- List of tracks -->
    <TracksSearchResult
      :searchQuery="searchQuery"
      :filters="filters"
      @click="onSearchResultItemClicked"
    />
  </PageWithHeader>
</template>


<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import {
  useLibrary, TracksSearchResult, TracksSearchFilters,
  type TracksFilterValue
} from '@lectorium/library'
import {
  Searchbar, PageWithHeader, useUserData
} from '@lectorium/shared'

// ── Dependencies ────────────────────────────────────────────────────
const userData = useUserData()
const library = useLibrary()

// ── State ───────────────────────────────────────────────────────────
const tracksCount = useLocalStorage('library.tracks.count', 0)
const searchQuery = ref('')
const filters     = ref<TracksFilterValue>({})

// ── Hooks ───────────────────────────────────────────────────────────
onBeforeMount(async () => {
  tracksCount.value = await library.tracks.getCount()
})

// ── Handlers ────────────────────────────────────────────────────────
async function onSearchResultItemClicked(trackId: string) {
  await userData.playlist.addTrack(trackId)
}

</script>
