
<script setup lang="ts">
	import moment from 'moment'
  import { VNode, computed, h, ref, watch } from 'vue';
	import { useStore } from 'vuex'
	import FeedArticles from '@app/pages/home/components/FeedArticles.vue';

	export interface IFeedTab {
		tabName: string;
		id: string;
		children: VNode;
	}

	const store = useStore()
	const tabQuery = ref('global');		
	const currentTabs = computed<IFeedTab[]>(() => (store.getters["article/getGroupArticles"] ?? []).map((groupArticle) => ({
			tabName:`${groupArticle.tag.charAt(0).toUpperCase()}${groupArticle.tag.substring(1)} Feed`,
			id: `${groupArticle.tag}`,
			children: h(FeedArticles, {
				pagination: {
					totalItems: groupArticle.articles?.meta?.totalItems ?? 0,
					itemsPerPage: groupArticle.articles?.meta?.itemsPerPage ?? 10,
					currentPage: groupArticle.articles?.meta?.currentPage ?? 1,
				},
				feedArticles: (groupArticle.articles?.items ?? []).map((article, i) => ({
					articleId: article?.id,
					authorName: article?.user?.username,
					authorId: article?.user?.id,
					authorAvatar: article?.user?.avatarUrl,
					createdAt: `${moment(article?.updatedAt ? Number(article?.updatedAt): Number( article?.createdAt)).format('MMMM DD YYYY')}`,
					title: article?.title,
					content: article?.content,
					likes: article?.likes,
					liked: false,
				})).sort(first => first?.id === 'global' ? -1 : 1),
				tag: `${groupArticle.tag}`
		})
	}))) 

	watch(currentTabs, (tabs) => {
		if(tabs.length > 0 && !tabs.some(tab => tab.id === `${tabQuery.value}`)){
			tabQuery.value = tabs[tabs.length - 1].id
		}
	})

	const handleChangeTab = (activeKey) => {
		tabQuery.value = activeKey;
	}

</script>

<template >
	<a-tabs v-model:activeKey="tabQuery"
			class="feeds__tabs"
			@change="handleChangeTab"
		>
		<a-tab-pane v-for="tab in currentTabs" :key="tab.id" :destroyInactiveTabPane="true" :tab="tab.tabName"><component :is="tab.children"></component></a-tab-pane>
	</a-tabs>
</template>

<style lang="scss">
	@import '@app/app.scss';
	
	.feeds {
		font-size: 16px;
	}
</style>
