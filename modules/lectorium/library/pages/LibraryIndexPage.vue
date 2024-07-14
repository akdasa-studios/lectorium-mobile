<template>
  <PageWithDrawer ref="page">
    <template v-slot:drawer>
      <Searchbar v-model="searchQuery" />
      <UserCollectionsList
        v-if="isCollectionsVisible"
        @add="isCreateDialogOpen = true"
      />
    </template>

    <h1
      v-if="isCollectionsVisible"
      class="ion-padding"
    >
      My playlist
    </h1>

    <UserPlaylist
      v-show="searchQuery === ''"
      @click="onPlaylistItemClicked"
    />
    <TracksSearchResult
      v-show="searchQuery !== ''"
      :searchQuery="searchQuery"
      @click="onSearchResultItemClicked"
    />

    <CollectionsCreateDialog
      v-model:isOpen="isCreateDialogOpen"
      @save="onCreateCollection"
    />
  </PageWithDrawer>
</template>


<script setup lang="ts">
import { computed, ref } from 'vue'
import { CollectionsCreateDialog } from '@lectorium/library/components'
import { Searchbar } from '@lectorium/shared/components'
import { PageWithDrawer } from '@lectorium/shared/components'
import { useAudioPlayer } from '@lectorium/shared/composables'
import { TracksSearchResult, UserPlaylist, UserCollectionsList, useUserData } from '@lectorium/library'
import { Collection } from '@core/models'

// ── Dependencies ────────────────────────────────────────────────────
const userData = useUserData()
const audioPlayer = useAudioPlayer()
const page = ref(null)

// ── State ───────────────────────────────────────────────────────────
const searchQuery = ref('')
const isCollectionsVisible = computed(() => searchQuery.value === '')
const isCreateDialogOpen = ref(false)

// ── Handlers ────────────────────────────────────────────────────────
async function onPlaylistItemClicked(trackId: string) {
  if (audioPlayer.state.value.trackId === trackId) {
    audioPlayer.togglePause()
  } else {
    const status = await userData.playlistItems.get(trackId)
    audioPlayer.play(trackId, status.played)
  }
}

function onSearchResultItemClicked(trackId: string) {
  console.log('onSearchResultItemClicked', trackId)
  userData.playlistItems.addTrack(trackId)
}

async function onCreateCollection(collection: Collection) {
  console.log('onCreateCollection', collection)
  await userData.collections.add(collection)
  isCreateDialogOpen.value = false
}
</script>
