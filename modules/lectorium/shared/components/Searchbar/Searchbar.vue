<template>
  <div
    v-if="isAndroid"
    class="search"
  >
    <IonInput
      fill="outline"
      placeholder="Search"
      :clear-input="true"
      @input="(e) => searchQuery = e.target.value"
    />
  </div>
  <IonSearchbar
    v-else
    placeholder="Search"
    @input="(e) => searchQuery = e.target.value"
  />
</template>


<script setup lang="ts">
import { IonInput, IonSearchbar, isPlatform } from '@ionic/vue'

// ── Interface ───────────────────────────────────────────────────────
const searchQuery = defineModel<string>({ type: String, default: '' })

// ── State ───────────────────────────────────────────────────────────
const isAndroid = isPlatform('android')
</script>


<style scoped>
.search {
  margin: 10px;
}
</style>
