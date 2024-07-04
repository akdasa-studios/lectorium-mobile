<template>
  <IonModal :isOpen="isOpen">
    <Header>
      <IonToolbar>
        <IonTitle>Create collection</IonTitle>
        <IonButtons slot="end">
          <IonButton @click="isOpen = false">Close</IonButton>
        </IonButtons>
      </IonToolbar>
    </Header>

    <IonContent>
      <IonList lines="full" class="ion-no-margin ion-no-padding">
        <IonItem>
          <IonLabel position="stacked">Name</IonLabel>
          <IonInput aria-label="First Name" type="text" v-model="collection.title"></IonInput>
        </IonItem>

        <IonItem :button="true" @click="isSelectAuthorDialogOpen = true">
          <IonLabel>
            Authors
          </IonLabel>
          <IonNote slot="end">{{ collection.authors.length }}</IonNote>
        </IonItem>

        <IonItem :button="true" @click="isSelectSourcesDialogOpen = true">
          <IonLabel>
            Sources
          </IonLabel>
          <IonNote slot="end">{{ collection.sources.length }}</IonNote>
        </IonItem>

        <IonItem :button="true" @click="isSelectLanguagesDialogOpen = true">
          <IonLabel>
            Languages
          </IonLabel>
          <IonNote slot="end">{{ collection.languages.length }}</IonNote>
        </IonItem>
      </IonList>
    </IonContent>

    <SelectAuthorDialog
      v-model:open="isSelectAuthorDialogOpen"
      @select="onAuthorsSelected"
    />
    <SelectSourcesDialog
      v-model:open="isSelectSourcesDialogOpen"
      @select="onSourcesSelected"
    />
    <SelectLanguagesDialog
      v-model:open="isSelectLanguagesDialogOpen"
      @select="onLanguagesSelected"
    />
  </IonModal>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import { useAsyncState } from '@vueuse/core'
import { Collection } from '@core/models'
import {
  IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonContent, IonList, IonItem, IonLabel, IonNote, IonInput
} from '@ionic/vue'
import { Header } from '@lectorium/shared/components'
import { SelectAuthorDialog, SelectSourcesDialog, SelectLanguagesDialog } from '@lectorium/library/components'
import { useLibrary } from '@lectorium/library/composables'

// ── Dependencies ────────────────────────────────────────────────────
const library = useLibrary()

// ── Interface ───────────────────────────────────────────────────────
const isOpen = defineModel('isOpen', { type: Boolean, default: false, })
const { state: collection } = useAsyncState(
  async () => toModelView(await library.collections.getById("11")),
  {}, { shallow: false })

// ── State ───────────────────────────────────────────────────────────
const isSelectAuthorDialogOpen = ref(false)
const isSelectSourcesDialogOpen = ref(false)
const isSelectLanguagesDialogOpen = ref(false)

// ── Handlers ────────────────────────────────────────────────────────
function onAuthorsSelected(authorIds: string[]) {
  collection.value.authors = authorIds
}

function onSourcesSelected(sourceIds: string[]) {
  collection.value.sources = sourceIds
}

function onLanguagesSelected(languageIds: string[]) {
  collection.value.languages = languageIds
}

// ── Helpers ─────────────────────────────────────────────────────────
function toModelView(collection: Collection) {
  return {
    title: collection.title,
    authors: collection.authors || [],
    sources: collection.sources || [],
    languages: collection.languages || [],
  }
}
</script>
