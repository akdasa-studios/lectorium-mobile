<template>
  <div class="Container">
    <div class="PlaylistEmpty">
      <div class="help">
        {{ $t('nothing-found') }}
      </div>
      <span>
        {{ $t('change-query') }}
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
  text-align: center;
  width: 75vw;
}

.image {
  max-width: 200px;
}

.help {
  margin: 1rem;
  font-weight: bold;
}
</style>