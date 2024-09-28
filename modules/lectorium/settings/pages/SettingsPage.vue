<template>
  <PageWithHeader
    title="Settings"
    :loading="false"
    :headerBorder="false"
  >
    <UserMediaList />
  </PageWithHeader>
</template>


<script setup lang="ts">
import { PageWithHeader } from '@lectorium/shared'
import { UserMediaList } from '@lectorium/settings'
</script>

