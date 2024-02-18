<template >
  <router-link to="/home">Go to Home</router-link>
  <router-view></router-view>
  {{this.$store.state.count}}
</template>

<script >
  export default {
  }
</script>

<style>
</style>
