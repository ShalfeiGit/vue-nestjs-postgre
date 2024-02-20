<template >
  <router-link to="/home">Go to Home</router-link>
  <router-view></router-view>
  {{this.$store.state.count}}
  <button @click="this.likeArticleByUserAction({user: 'Valentin'})">Показать ребенка с анимацией</button>
</template>

<script >
  import { mapActions } from 'vuex'
  export default {
    methods: {
      ...mapActions('userInfo', ['likeArticleByUserAction'])
    }
  }
</script>

<style>
</style>
