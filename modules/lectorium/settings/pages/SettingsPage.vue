<template>
  <PageWithHeader
    title="Settings"
    :loading="false"
    :headerBorder="false"
  >
  </PageWithHeader>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import { PageWithHeader } from '@lectorium/shared/components'
import Searchbar from '@lectorium/shared/components/Searchbar/Searchbar.vue'
import { TracksSearchResult, useUserData } from '@lectorium/playlist'

// ── Dependencies ────────────────────────────────────────────────────
const userData = useUserData()

// ── State ───────────────────────────────────────────────────────────
const searchQuery = ref('')

// ── Handlers ────────────────────────────────────────────────────────
function onSearchResultItemClicked(trackId: string) {
  console.log('onSearchResultItemClicked', trackId)
  userData.playlistItems.service.addTrack(trackId)
}
</script>

