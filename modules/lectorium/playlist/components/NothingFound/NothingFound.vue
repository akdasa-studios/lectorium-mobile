<template>
  <div class="PlaylistEmpty">
    <div class="help">
      Nothing found
    </div>
    <span>
      In your library there are no tracks that satisfy your criteria.
      Try to change the search query.
    </span>
  </div>
</template>

<script setup lang="ts">
</script>


<style scoped>
.PlaylistEmpty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  text-align: center;
  margin-top: 50%;
  transform: translateY(+25%);
  /* position: relative; */
  /* top: 25%; */
}

.image {
  width: 100%;
  max-width: 200px;
}

.help {
  margin: 1rem;
  font-weight: bold;
}
</style>