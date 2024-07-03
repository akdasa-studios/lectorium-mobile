<template>
  <IonModal :isOpen="isOpen">
    <IonHeader>
      <IonToolbar>
        <IonTitle>Modal</IonTitle>
        <IonButtons slot="end">
          <IonButton @click="isOpen = false">Close</IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>

    <IonContent>
      <IonList>
        <IonListHeader>
          <IonLabel>Authors</IonLabel>
          <IonButton @click="isSelectAuthorDialogOpen = !isSelectAuthorDialogOpen">Add</IonButton>
        </IonListHeader>

        <IonItemSliding v-for="i in 4">
          <IonItem>
            <IonLabel>Srila Prabhupada</IonLabel>
          </IonItem>

          <IonItemOptions>
            <IonItemOption color="danger">Delete</IonItemOption>
          </IonItemOptions>
        </IonItemSliding>
      </IonList>


      <IonList>
        <IonListHeader>
          <IonLabel>Sources</IonLabel>
          <IonButton>Add</IonButton>
        </IonListHeader>

        <IonItemSliding v-for="i in 4">
          <IonItem>
            <IonLabel>Bhagavad gita</IonLabel>
          </IonItem>

          <IonItemOptions>
            <IonItemOption>Favorite</IonItemOption>
            <IonItemOption color="danger">Delete</IonItemOption>
          </IonItemOptions>
        </IonItemSliding>
      </IonList>

      <IonList>
        <IonListHeader>
          <IonLabel>Languages</IonLabel>
          <IonButton>Add</IonButton>
        </IonListHeader>

        <IonItemSliding v-for="i in 2">
          <IonItem>
            <IonLabel>RU</IonLabel>
          </IonItem>

          <IonItemOptions>
            <IonItemOption>Favorite</IonItemOption>
            <IonItemOption color="danger">Delete</IonItemOption>
          </IonItemOptions>
        </IonItemSliding>
      </IonList>

    </IonContent>

    <!-- Author selector dialog -->
    <SelectAuthorDialog
      v-model:open="isSelectAuthorDialogOpen"
      @select="onAuthorSelected"
    >
      <template v-slot="{ item }">
        <IonItem>
          <IonLabel>{{ item.name }}</IonLabel>
        </IonItem>
      </template>
    </SelectAuthorDialog>
  </IonModal>
</template>


<script setup lang="ts">
import {
  IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonContent, IonList, IonItem, IonLabel, IonItemGroup, IonItemDivider,
  IonListHeader, IonItemSliding, IonItemOptions, IonItemOption,
} from '@ionic/vue'
import { SelectAuthorDialog } from '@/library/components'
import { ref } from 'vue';
import { Author } from '@/library/services'
import { useCollectionsRepository } from '@/library/composables'
import { useAsyncState } from '@vueuse/core'

// ── Dependencies ────────────────────────────────────────────────────
const collectionsRepository = useCollectionsRepository()

// ── Interface ───────────────────────────────────────────────────────
const isOpen = defineModel('isOpen', { type: Boolean, default: false, })
const { state: collection } = useAsyncState(
  () => collectionsRepository.getById("11"), {})

// ── State ───────────────────────────────────────────────────────────
const isSelectAuthorDialogOpen = ref(false)

// ── Handlers ────────────────────────────────────────────────────────
function onAuthorSelected(author: Author) {
  console.log('Author selected:', author)
}
</script>