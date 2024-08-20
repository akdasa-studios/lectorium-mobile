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
import { TracksSearchResult } from '@lectorium/playlist'
import { useUserData } from '@lectorium/shared'

// ── Dependencies ────────────────────────────────────────────────────
const userData = useUserData()

// ── State ───────────────────────────────────────────────────────────
const searchQuery = ref('')

// ── Handlers ────────────────────────────────────────────────────────
async function onSearchResultItemClicked(trackId: string) {
  await userData.playlist.addTrack(trackId)
}
</script>
