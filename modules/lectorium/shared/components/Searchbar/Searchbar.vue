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
      ref="refInput"
    />
  </div>
  <IonSearchbar
    v-else
    placeholder="Search"
    @input="(e) => searchQuery = e.target.value"
    v-model="searchQuery"
    ref="refInput"
  />
</template>


<script setup lang="ts">
import { IonInput, IonSearchbar, isPlatform } from '@ionic/vue'
import { ref } from 'vue'

// ── Interface ───────────────────────────────────────────────────────
const searchQuery = defineModel<string>({ type: String, default: '' })

defineExpose({
  setFocus: setFocus
})

async function setFocus() {
  refInput.value?.$el.setFocus()
}

// ── State ───────────────────────────────────────────────────────────
const isAndroid = isPlatform('android')
const refInput = ref<InstanceType<typeof IonInput>>()
</script>


<style scoped>
.search {
  margin: 10px;
}
</style>
