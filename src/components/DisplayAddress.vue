<template>
    <span :title="address">
      {{ trimmedAddress }} 
    </span>
</template>

<script>
  export default {
    name: 'DisplayAddress',
    props: ['address'],

    computed: {
      trimmedAddress() { 
        return this.address.substring(0, 8) + ('(...)') + this.address.substring(this.address.length - 5, this.address.length)
      }
    }
  }
</script>
