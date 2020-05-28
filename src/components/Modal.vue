<template>
  <div>
    <div
      class="overlay"
      @click.stop="$emit('close')"
    />
    <div class="modal-content">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.overlay {
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 500;
}

.modal-content {
  background-color: transparent;
  border: 0;
  position: absolute;
  z-index: 500;
}
</style>
