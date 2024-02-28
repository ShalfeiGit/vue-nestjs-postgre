<script setup lang="ts">
	import { message } from 'ant-design-vue';
	import { h } from 'vue'
	import { useRoute  } from 'vue-router'
	import {computed } from 'vue';

	import AppMenu from '@app/shared/menu/Menu.vue'
	import AppMessage from '@app/shared/message/Message.vue'
	import AppFooter from '@app/shared/footer/Footer.vue'
	import { NoticeType } from 'antd/es/message/interface'

	interface INotification {
		content: string,
		type: NoticeType
	}


	const openNotification = ({type, content}: INotification) => {
		message.open({
			type: type,
			content: h(AppMessage, { message: content})
		})
	}
</script>

<template >
	<app-menu :openNotification="openNotification"></app-menu>
	<router-view :openNotification="openNotification"></router-view>
	<app-footer></app-footer>	
</template>
