<template>
  <PageWithDrawer
    ref="page"
    v-model:is-drawer-open="isDrawerOpen"
    :can-open-drawer="searchQuery === ''"
  >

    <template v-slot:drawer>
      <Searchbar
        :class="{'pinnedSearch': isSearchBarPinned }"
        v-model="searchQuery"
        @focus="(v) => isSearchBarPinned = v || searchQuery !== ''"
      />
      <div :class="{'ppp': isSearchBarPinned}"></div>
      <UserCollectionsList
        @add="isCreateDialogOpen = true"
      />
    </template>

    <h1
      v-if="!searchQuery"
      class="ion-padding"
    >
      My playlist
    </h1>

    <UserPlaylist
      v-show="searchQuery === ''"
      @click="onPlaylistItemClicked"
    />

    <TracksSearchResult
      class="searchResults"
      v-if="searchQuery !== ''"
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
import { ref, watch } from 'vue'
import { CollectionsCreateDialog } from '@lectorium/library/components'
import { Searchbar } from '@lectorium/shared/components'
import { PageWithDrawer } from '@lectorium/shared/components'
import { useAudioPlayer } from '@lectorium/shared/composables'
import { TracksSearchResult, UserPlaylist, UserCollectionsList, useUserData } from '@lectorium/library'
import { Collection } from '@core/models'

// ── Dependencies ────────────────────────────────────────────────────
const userData = useUserData()
const audioPlayer = useAudioPlayer()
const page = ref<InstanceType<typeof PageWithDrawer>>()

// ── State ───────────────────────────────────────────────────────────
const searchQuery = ref('')
const isCreateDialogOpen = ref(false)
const isDrawerOpen = ref(false)
const isSearchBarPinned = ref(false)


// ── Hooks ───────────────────────────────────────────────────────────
watch(searchQuery, (value) => {
  if (value) {
    isDrawerOpen.value = false
  } else {
    isDrawerOpen.value = true
    page.value?.scrollToTop()
  }
})

// ── Handlers ────────────────────────────────────────────────────────
async function onPlaylistItemClicked(trackId: string) {
  if (audioPlayer.state.value.trackId === trackId) {
    audioPlayer.togglePause()
  } else {
    const status = await userData.playlistItems.service.get(trackId)
    audioPlayer.play(trackId, status.played)
  }
}

function onSearchResultItemClicked(trackId: string) {
  console.log('onSearchResultItemClicked', trackId)
  userData.playlistItems.service.addTrack(trackId)
}

async function onCreateCollection(collection: Collection) {
  console.log('onCreateCollection', collection)
  await userData.collections.add(collection)
  isCreateDialogOpen.value = false
}
</script>

<style>
.pinnedSearch {
  background-color: white;
  position: fixed;
  top: 0px;
  z-index: 100;
  width: calc(100% - 20px);
}

.searchResults {
  padding-top: 76px;
}

.ppp {
  padding-top: 76px;
}
</style>