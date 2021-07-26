<template>
  <div class="modal">
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
.modal {
  .overlay {
    bottom: 0;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 90;
  }

  .modal-content {
    position: absolute;
    z-index: 90;
  }
}
</style>
