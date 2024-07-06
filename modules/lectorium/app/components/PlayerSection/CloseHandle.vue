<template>
  <div class="CloseHandle">
    <div class="handle"></div>
  </div>
</template>


<script setup lang="ts">
</script>


<style scoped>
.CloseHandle {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: .5rem;
}

.handle {
  border-radius: 10px;
  background-color: var(--ion-color-oxford-blue-tint);
  height: 5px;
  width: 40px;
}
</style>