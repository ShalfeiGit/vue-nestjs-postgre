<template >
  <router-link to="/home">Go to Home</router-link>
  <router-view></router-view>
  <a-button type="primary" @click="this.likeArticleByUserAction({user: 'Valentin'})">Add</a-button>
  {{this.$store.state.count}}
  <button @click="this.likeArticleByUserAction({user: 'Valentin'})">Показать ребенка с анимацией</button>
</template>

<script >
  import { mapActions } from 'vuex'
  import { Button } from 'ant-design-vue';

  
  export default {
    components: {
      AButton: Button
    },
    methods: {
      ...mapActions('userInfo', ['likeArticleByUserAction'])
    }
  }
</script>

<style>
</style>
