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
import { TracksSearchResult } from '@lectorium/playlist'
import { useUserData } from '@lectorium/shared'
import { useLibrary, type TracksFilterValue } from '@lectorium/library'
import { SearchFilters } from '@lectorium/library'
import { Searchbar } from '@lectorium/shared/components'
import { PageWithHeader } from '@lectorium/shared/components'
import { useLocalStorage } from '@vueuse/core'

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
