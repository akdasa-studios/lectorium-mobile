<template>
  <div class="Container">
    <div class="PlaylistEmpty">
      <img
        src="@lectorium/playlist/assets/empty.png"
        class="image"
        alt="Playlist is empty"
      />

      <div class="help">
        {{ $t('playlist-empty') }}
      </div>
      <span>
        {{ $t('add-tracks-from-library') }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>


<style scoped>
.Container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.PlaylistEmpty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 75vw;
  text-align: center;
}

.image {
  max-width: 200px;
}

.help {
  margin: 1rem;
  font-weight: bold;
}
</style>