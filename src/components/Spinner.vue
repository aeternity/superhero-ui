<template>
  <span class="spinner" />
</template>

<style lang="scss" scoped>
.spinner {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  border: 0.25em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: 0.75s linear infinite spinner-border;

  @keyframes spinner-border {
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
