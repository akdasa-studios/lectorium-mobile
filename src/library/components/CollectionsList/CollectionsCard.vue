<template>
  <CollectionsCardBase class="CollectionsCard">
    <div class="content"></div>
    <div class="title">{{ title }}</div>
  </CollectionsCardBase>
</template>


<script setup lang="ts">
import CollectionsCardBase from './CollectionsCardBase.vue'

// ── Interface ───────────────────────────────────────────────────────
const props = defineProps<{
  title: string
  cover: string
}>()

// ── State ───────────────────────────────────────────────────────────
const cover = `url(${props.cover})`
</script>


<style scoped>
.CollectionsCard {
  background-image: v-bind(cover);
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;
  background-color: var(--ion-color-primary);
}

.content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.title {
  color: var(--ion-color-light);
  font-size: .75rem;
  font-weight: bold;

  padding: .75em;
  padding-top: 2em;
  background: linear-gradient(
                rgba(var(--ion-color-dark-rgb), 0),
                rgba(var(--ion-color-dark-rgb), 1)
              );
}
</style>
