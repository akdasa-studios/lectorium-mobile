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
    />
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
  /* background-color: var(--ion-color-light); */
  margin: 10px;
  backdrop-filter: blur(10px);
  width: calc(100% - 20px);
}
</style>
