<template>
  <SelectorDialog
    v-model:open="open"
    v-model:query="query"
    :items="filteredAuthors"
  >
    <template v-slot="{ item }">
      <IonItem @click="onItemClicked">
        <IonAvatar slot="start">
          <img src="https://ionicframework.com/docs/img/demos/avatar.svg"/>
        </IonAvatar>
        <IonLabel>{{ item.name }}</IonLabel>
      </IonItem>
    </template>
  </SelectorDialog>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import { IonItem, IonLabel, IonAvatar } from '@ionic/vue'
import { useArrayFilter, useAsyncState } from '@vueuse/core'
import { SelectorDialog } from '@lectorium/shared/components'
import { useAuthorsRepository } from '@lectorium/library/composables'
import { Author } from '@lectorium/library/services'

// ── Dependencies ────────────────────────────────────────────────────
const authorsRepository = useAuthorsRepository()

// ── Interface ───────────────────────────────────────────────────────
const open = defineModel('open', { type: Boolean, default: false, })

const emit = defineEmits<{
  select: [item: Author]
}>()

// ── State ───────────────────────────────────────────────────────────
const { state: authors } = useAsyncState(() => authorsRepository.getAll(), [])
const filteredAuthors = useArrayFilter(authors, (author) => compareStrings(author.name, query.value))
const query = ref('')

// ── Handlers ────────────────────────────────────────────────────────
function onItemClicked(author: Author) {
  open.value = false
  emit('select', author)
}

// ── Helpers ─────────────────────────────────────────────────────────
function compareStrings(a: string, b: string) {
  return a.toLocaleLowerCase().includes(b.toLocaleLowerCase())
}
</script>
