<template>
  <div class="CollectionsCardBase">
    <slot></slot>
  </div>
</template>


<style scoped>
.CollectionsCardBase {
  display: flex;
  flex-direction: column;
  height: 200px;
  margin: 10px;
  border-radius: 5px;
  overflow: hidden;
}
</style>