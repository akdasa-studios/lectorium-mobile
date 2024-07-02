<template>
  <div class="search">
    <IonInput
      fill="outline"
      placeholder="Search"
      :clear-input="true"
      @input="(e) => searchQuery = e.target.value"
    >
    </IonInput>
  </div>
</template>


<script setup lang="ts">
import { IonInput } from '@ionic/vue'

const searchQuery = defineModel<string>({ type: String, default: '' })
</script>


<style scoped>
.search {
  margin: 10px;
}
</style>
