<template>
  <SelectorDialog
    :title="title"
    :open="open"
    @select="onSelect"
    @close="onClose"
  >
    <Searchbar
      v-if="items.length > 10"
      v-model="query"
      :placeholder="$t('search')"
    />
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
  </SelectorDialog>
</template>


<script setup lang="ts" generic="T extends Item">
import { computed, ref } from 'vue'
import { IonList, IonCheckbox, IonItem } from '@ionic/vue'
import { Searchbar } from '@lectorium/shared'
import SelectorDialog from './SelectorDialog.vue'

// ── Interface ───────────────────────────────────────────────────────
export type ItemId = string
export type Item = {
  id: ItemId
  title: string
  checked: boolean
}

const props = defineProps<{
  title: string,
  open: boolean,
}>()

const emit = defineEmits<{
  close: [],
  select: [items: ItemId[]]
}>()

const items = defineModel<Item[]>('items', { type: Array<Item>, default: () => [] as Item[] })

// ── State ───────────────────────────────────────────────────────────
const query = ref('')

const filteredItems = computed(() =>
  items.value.filter((item) => compareStrings(item.title, query.value) || item.checked,
))

// ── Handlers ────────────────────────────────────────────────────────
function onClose() {
  emit('close')
}

function onSelect() {
  const itemIds = items.value
    .filter((item) => item.checked)
    .map((item) => item.id)
  emit('select', itemIds)
}

// ── Helpers ─────────────────────────────────────────────────────────
function compareStrings(a: string, b: string) {
  return a.toLocaleLowerCase().includes(b.toLocaleLowerCase())
}
</script>
