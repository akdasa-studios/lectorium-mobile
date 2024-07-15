<template>
  <div
    v-if="isAndroid"
    class="search"
  >
    <IonInput
      fill="outline"
      placeholder="Search"
      :clear-input="true"
      v-model="searchQuery"
      @ion-focus="onFocus"
      @ion-blur="onBlur"
    >
      <!-- <ion-icon v-if="!searchQuery" slot="end" :icon="lockClosed" aria-hidden="true"></ion-icon> -->
    </IonInput>
  </div>
  <IonSearchbar
    v-else
    placeholder="Search"
    @input="(e) => searchQuery = e.target.value"
    v-model="searchQuery"
  />
</template>


<script setup lang="ts">
import { IonInput, IonSearchbar, isPlatform } from '@ionic/vue'
import { lockClosed } from 'ionicons/icons'

// ── Interface ───────────────────────────────────────────────────────
const searchQuery = defineModel<string>({ type: String, default: '' })

const emit = defineEmits<{
  focus: [value: boolean]
}>()

// ── State ───────────────────────────────────────────────────────────
const isAndroid = isPlatform('android')

// ── Handlers ────────────────────────────────────────────────────────
function onFocus() {
  emit('focus', true)
}

function onBlur() {
  emit('focus', false)
}
</script>


<style scoped>
.search {
  margin: 10px;
}
</style>
