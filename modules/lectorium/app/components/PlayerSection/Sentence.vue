<template>
  <span>{{ text }}&nbsp;</span>
</template>

<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>