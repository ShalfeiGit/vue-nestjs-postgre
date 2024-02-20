import { createApp } from 'vue/dist/vue.esm-bundler'
import App from '@app/App.vue'
import Antd from 'ant-design-vue'
import router from '@app/routes/routes'
import store from '@app/store/store'
import 'ant-design-vue/dist/reset.css'

createApp({
	components: {
		App
	}
}).use(Antd).use(store).use(router).mount('#root')