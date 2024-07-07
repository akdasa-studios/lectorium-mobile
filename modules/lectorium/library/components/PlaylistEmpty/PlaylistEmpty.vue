<template>
  <div class="PlaylistEmpty">
    <img
      src="@lectorium/library/assets/empty.png"
      class="image"
      alt="Playlist is empty"
    />

    <div class="help">
      Playlist is empty
    </div>
    <span>
      Swipe down to add tracks to the playlist from the library.
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
  height: 100%;
  padding: 2rem;
  text-align: center;
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