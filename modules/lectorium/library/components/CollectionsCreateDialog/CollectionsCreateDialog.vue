<template>
  <IonModal
    :isOpen="isOpen"
  >
    <CollectionsDialogHeader
      @save="onSave()"
      @close="onClose()"
    />

    <CollectionsDialogForm
      v-model:title="collection.title"
      :authorsCount="collection.authors.length"
      :sourcesCount="collection.sources.length"
      :languagesCount="collection.languages.length"
      @selectAuthors="isSelectAuthorDialogOpen = true"
      @selectSources="isSelectSourcesDialogOpen = true"
      @selectLanguages="isSelectLanguagesDialogOpen = true"
    />

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
import { ref, toRaw } from 'vue'
import { Collection } from '@core/models'
import { IonModal } from '@ionic/vue'
import { SelectAuthorDialog, SelectSourcesDialog, SelectLanguagesDialog } from '@lectorium/library/components'
import { EmptyCollection } from '@lectorium/library/services/repositories/CollectionsRepository'
import CollectionsDialogHeader from './CollectionsDialogHeader.vue'
import CollectionsDialogForm from './CollectionsDialogForm.vue'

// ── Interface ───────────────────────────────────────────────────────
const isOpen = defineModel('isOpen', { type: Boolean, default: false, })

const emit = defineEmits<{
  save: [collection: Collection],
  close: [],
}>();

// ── State ───────────────────────────────────────────────────────────
const collection = ref<Collection>(EmptyCollection())
const isSelectAuthorDialogOpen = ref(false)
const isSelectSourcesDialogOpen = ref(false)
const isSelectLanguagesDialogOpen = ref(false)

// ── Handlers ────────────────────────────────────────────────────────
function onClose() {
  isOpen.value = false
}

function onSave() {
  emit('save', toRaw(collection.value))
  isOpen.value = false
  collection.value = EmptyCollection()
}

function onAuthorsSelected(authorIds: string[]) {
  collection.value.authors = authorIds
}

function onSourcesSelected(sourceIds: string[]) {
  collection.value.sources = sourceIds
}

function onLanguagesSelected(languageIds: string[]) {
  collection.value.languages = languageIds
}
</script>
