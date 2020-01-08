<template>
  <div id="app">
    <TipsList />
  </div>
</template>

<script>
import TipsList from './components/TipsList.vue'

export default {
  name: 'app',
  components: {
      TipsList
  },
  created () {}
}
</script>

<style>
#app {
  font-family: 'Roboto', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  max-height: 100vh;
  height: 100vh;
  overflow-y: auto;
  background-color: white;
  display: flex;
  justify-content: center;
}
</style>
