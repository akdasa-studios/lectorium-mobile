<template>
  <div class="timestamp">
    {{ formatTime(start || 0) }}
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text?: string
  start?: number
  end?: number
}>()


function formatTime(ms: number) {
  const seconds = Math.floor(ms % 60);
  const minutes = Math.floor((ms / 60) % 60);
  const hours = Math.floor((ms / 60 / 60));

  let formattedTime;

  if (ms < 60000) {
    formattedTime = [minutes.toString().padStart(2, "0"), seconds.toString().padStart(2, "0")].join(":");
  } else {
    if (hours === 0) {
      formattedTime = [minutes.toString(), seconds.toString().padStart(2, "0")].join(":");
    } else {
      formattedTime = [hours.toString(), minutes.toString().padStart(2, "0"), seconds.toString().padStart(2, "0")].join(":");
    }
  }

  return formattedTime;
}
</script>


<style scoped>
.timestamp {
  font-size: .6rem;
}
</style>