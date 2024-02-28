<script setup lang="ts">
	import { ref, h, watch } from 'vue';
	import { TabsProps } from 'antd'
	import { useRouter, useRoute } from 'vue-router'

	import UserContent from '@app/pages/userInfo/components/userContent.vue'
	import ArticleContent from '@app/pages/userInfo/components/articleContent.vue'
	import { INotificationAction } from '@app/store/modules/userInfo';

	interface IProps{
		openNotification: INotificationAction['openNotification'];
	}
	const props = defineProps<IProps>()
	const router = useRouter()
	const route = useRoute()
  const tabQuery = ref('user-content');		

	watch(() => route.params.query,
    async () => {
			tabQuery.value = route.query?.tab as string
    },
    {deep: true, immediate: true})
	const tabs = ref<TabsProps['items']>([
		{
			key: 'user-content',
			label: 'User Info',
			children: h(UserContent, { openNotification: props.openNotification, key: 'user-content'}),
		},
		{
			key: 'articles-content',
			label: 'Articles Info',
			children: h(ArticleContent, { openNotification: props.openNotification, key: 'user-content'}),
		}
	])
	const handleChangeTab = (activeKey) => {
		router.push({
      name: "userInfo",
			params: {
        username: route.params.username
      },
			query: {
				tab: activeKey
			}
    })
	}
</script>

<template >
	<div className="user-info">
		<a-tabs v-model:activeKey="tabQuery"
			class="user-info__tabs"
			@change="handleChangeTab"
		>
		<a-tab-pane v-for="tab in tabs" :key="tab.key" :destroyInactiveTabPane="true" :tab="tab.label"><component :is="tab.children"></component></a-tab-pane>
	</a-tabs>
	</div>
</template>

<style lang="scss">
	@import '@app/app.scss';

	.user-info{
		display: flex;
		justify-content: center;
		width: 100%;
		&__tabs{
			width: 50%;
		}
	}
</style>
