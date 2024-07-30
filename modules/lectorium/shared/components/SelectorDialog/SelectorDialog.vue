<template>
  <IonModal
    :isOpen="open"
    @didDismiss="open = false"
  >
    <Header>
      <IonToolbar>
        <IonTitle>{{ title }}</IonTitle>
        <IonButtons slot="end">
          <IonButton @click="onClose">Close</IonButton>
        </IonButtons>
      </IonToolbar>
    </Header>

    <IonContent>
      <Searchbar v-model="query" />
      <IonList lines="full" class="ion-no-margin ion-no-padding">
        <IonItem
          v-for="item in filteredItems"
          :key="item.id"
        >
          <IonCheckbox
            label-placement="end"
            justify="start"
            v-model="item.checked"
          >
            {{ item.title }}
          </IonCheckbox>
        </IonItem>
      </IonList>
    </IonContent>
  </IonModal>
</template>


<script setup lang="ts" generic="T extends Item">
import {
  IonModal, IonContent, IonList, IonSearchbar, IonToolbar,
  IonButtons, IonButton, IonTitle, IonCheckbox, IonItem
} from '@ionic/vue'
import { Header, Searchbar } from '@lectorium/shared/components'
import { useArrayFilter } from '@vueuse/core'
import { reactive, ref, toRef } from 'vue'

// ── Interface ───────────────────────────────────────────────────────
export type ItemId = string
export type Item = {
  id: ItemId
  title: string
  checked: boolean
}

const props = defineProps<{
  title: string,
  items: Item[],
}>()

const emit = defineEmits<{
  select: [items: ItemId[]]
}>()

const open = defineModel('open', { type: Boolean, default: false })

// ── State ───────────────────────────────────────────────────────────
const query = ref('')
const items = reactive(toRef(props, 'items'))

const filteredItems = useArrayFilter(
  items, (item) => compareStrings(item.title, query.value) || item.checked)

// ── Handlers ────────────────────────────────────────────────────────
function onClose() {
  const itemIds = items.value
    .filter((item) => item.checked)
    .map((item) => item.id)
  emit('select', itemIds)
  open.value = false
}

// ── Helpers ─────────────────────────────────────────────────────────
function compareStrings(a: string, b: string) {
  return a.toLocaleLowerCase().includes(b.toLocaleLowerCase())
}
</script>
