<template>
  <PageWithDrawer ref="page">
    <template v-slot:drawer>
      <Searchbar v-model="searchQuery" />
      <CollectionsList
        v-if="isCollectionsVisible"
        :items=collections
        @add="isCreateDialogOpen = true"
      />
    </template>

    <UserPlaylist
      v-if="searchQuery === ''"
      @click="onPlaylistItemClicked"
    />
    <TracksSearchResult
      v-else
      :searchQuery="searchQuery"
      @click="onSearchResultItemClicked"
    />

    <CollectionsCreateDialog
      v-model:isOpen="isCreateDialogOpen"
    />
  </PageWithDrawer>
</template>


<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAsyncState } from '@vueuse/core'
import { CollectionsList, CollectionsCreateDialog } from '@lectorium/library/components'
import { Searchbar } from '@lectorium/shared/components'
import { useLibrary } from '@lectorium/library/composables'
import { PageWithDrawer } from '@lectorium/shared/components'
import { useAudioPlayer } from '@lectorium/shared/composables'
import { TracksSearchResult, UserPlaylist, useUserData } from '@lectorium/library'

// ── Dependencies ────────────────────────────────────────────────────
const library = useLibrary()
const userData = useUserData()
const audioPlayer = useAudioPlayer()
const page = ref(null)

// ── State ───────────────────────────────────────────────────────────
const searchQuery = ref('')
const { state: collections } = useAsyncState(() => library.collections.getAll(), [])

const isCollectionsVisible = computed(() => searchQuery.value === '')
const isCreateDialogOpen = ref(false)

// ── Handlers ────────────────────────────────────────────────────────
async function onPlaylistItemClicked(trackId: string) {
  if (audioPlayer.currentTrackId.value === trackId) {
    audioPlayer.playing.value = !audioPlayer.playing.value
  } else {
    const status = await userData.playlistItems.get(trackId)
    console.log('onPlaylistItemClicked', trackId, status)
    audioPlayer.playing.value = true
    audioPlayer.position.value = status?.played
    audioPlayer.currentTrackId.value = trackId
  }
}

function onSearchResultItemClicked(trackId: string) {
  console.log('onSearchResultItemClicked', trackId)
  userData.playlistItems.addTrack(trackId)
}
</script>
