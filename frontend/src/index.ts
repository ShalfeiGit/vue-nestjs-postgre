import { createApp } from 'vue/dist/vue.esm-bundler'
import App from '@app/App.vue'
import router from '@app/routes/routes'
import store from '@app/store/store'

createApp({
	components: {
		App
	}
}).use(store).use(router).mount('#root')