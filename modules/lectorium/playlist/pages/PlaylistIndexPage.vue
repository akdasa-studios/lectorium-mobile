<template>
  <IonPage>
    <!--
    <PageWithDrawer
      ref="page"
      v-model:is-drawer-open="isDrawerOpen"
      :can-open-drawer="true"
    >
    <template v-slot:drawer>
      <UserCollectionsList
        @add="isCreateDialogOpen = true"
      />
    </template>
    -->
    <IonContent>
      <UserPlaylist
        @click="onPlaylistItemClicked"
      />
    </IonContent>

    <!-- <CollectionsCreateDialog
      v-model:isOpen="isCreateDialogOpen"
      @save="onCreateCollection"
    /> -->
  </IonPage>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import { useUserData } from '@lectorium/shared'
import { IonContent, IonPage } from '@ionic/vue'
// import { PageWithDrawer } from '@lectorium/shared/components'
import { useAudioPlayer } from '@lectorium/shared/composables'
import { UserPlaylist, UserCollectionsList } from '@lectorium/playlist'
import { Collection } from '@core/models'

// ── Dependencies ────────────────────────────────────────────────────
const userData = useUserData()
const audioPlayer = useAudioPlayer()
// const page = ref<InstanceType<typeof PageWithDrawer>>()

// ── State ───────────────────────────────────────────────────────────
const isCreateDialogOpen = ref(false)
// const isDrawerOpen = ref(false)

// ── Handlers ────────────────────────────────────────────────────────
async function onPlaylistItemClicked(trackId: string) {
  if (audioPlayer.trackId.value === trackId) {
    audioPlayer.togglePause()
  } else {
    const status = await userData.playlist.get(trackId)
    if (
      status.mediaStatus === "downloaded" &&
      (status.transcriptStatus === "downloaded" ||
      status.transcriptStatus === "unavailable")
    ) {
      audioPlayer.play(trackId, status.played)
    }
  }
}

async function onCreateCollection(collection: Collection) {
  console.log('onCreateCollection', collection)
  await userData.collections.add(collection)
  isCreateDialogOpen.value = false
}
</script>
