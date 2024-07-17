<template>
  <div class="PlaylistEmpty">
    <img
      src="@lectorium/playlist/assets/empty.png"
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
  padding: 2rem;
  text-align: center;
  margin-top: 50%;
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