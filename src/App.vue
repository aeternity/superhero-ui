<template>
  <div id="app">
    <div>TEST</div>
    <RouterView />
  </div>
</template>

<script>
export default {

};
</script>

<style lang="scss">
:root {
  --container-width: 59rem;
}

@include mobile {
  :root {
    --container-width: 25rem;
  }
}

@media (min-width: 1200px) {
  html {
    font-size: 125%;
  }
}

@media (min-width: 1440px) {
  :root {
    --container-width: 61rem;
  }
}
</style>

<style lang="scss" scoped>
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  margin: 0 auto;
  min-height: 100vh;
  max-width: var(--container-width);
  display: flex;
  flex-direction: column;

  .not-bootstrap-row {
    flex-grow: 1;
    display: flex;
    flex-wrap: nowrap;

    .sidebar-sticky {
      flex-shrink: 0;

      > div {
        position: sticky;
        top: 0;
      }

      @include mobile {
        display: none;
      }

      .left-section,
      .right-section {
        padding-top: 1rem;
      }

      .left-section {
        width: 9.2rem;
        margin-right: 15px;

        @media (min-width: 1440px) {
          margin-right: calc(15px + 1rem); // TODO: Replace with a rem value
        }
      }

      .right-section {
        width: 17.5rem;
        margin-left: calc(15px + 0.8rem); // TODO: Replace with a rem value
      }
    }

    .router-view {
      flex-grow: 1;
      min-width: 0; // https://css-tricks.com/flexbox-truncated-text/
    }
  }
}
</style>
