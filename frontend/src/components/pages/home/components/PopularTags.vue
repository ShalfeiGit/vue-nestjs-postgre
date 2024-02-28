<script setup lang="ts" >
	import { IArticle, IGroupArticle } from '@app/store/modules/article';
	import { computed, onMounted } from 'vue';
	import { useStore } from 'vuex'

	interface IProps{
		page: number,
		limit: number
	}

	interface ITagsArticles{
		tag: string, 
		title: string,
	}

	const props = defineProps<IProps>()
	const store = useStore()

	const groupArticles = computed<IGroupArticle<IArticle>[]>(() => store.getters["article/getGroupArticles"])
	const popularTags = computed<ITagsArticles[]>(() => (store.getters["article/getTags"] ?? []).map(tagOption => ({
		tag: tagOption.value, 
		title: tagOption.label,
	})))

	onMounted(async () => {
		store.dispatch('article/loadTagOptionsAction')
		store.dispatch('article/loadAllArticlesAction', {page: props.page, limit: props.limit})
	})

	const handleSelectTag = (tag) => {
		groupArticles.value.some(groupArticle => groupArticle.tag === tag) 
			? store.dispatch('article/removeGroupArticlesAction', {tag}) 
			: store.dispatch('article/loadGroupArticlesAction', {tag, page: props.page, limit: props.limit})
	}

</script>

<template >
  <div class="popular-tags">
		<div class="popular-tags__header">
			<a-typography-title :level="4">Popular Tags</a-typography-title>
		</div>
		<div class="popular-tags__content">
			<a-button 
				v-for="popularTag, i in popularTags"
				class="popular-tags__tag"
				:danger="(groupArticles ?? []).some(groupArticle => groupArticle.tag === popularTag.tag)"
				:key="i"
				@click="handleSelectTag(popularTag.tag)"
			>
				{{popularTag.title}}
			</a-button>
		</div>
	</div>
</template>

<style lang="scss">
	@import '@app/app.scss';

	.popular-tags {
		background-color: $grey-color;
		margin-right: 40px;
		border-radius: 20px;
		margin-top: 20px;
		&__header{
			display: flex;
			margin-left: 25px;
		}
		&__content{
			display: flex;
			padding-left: 15px;
			padding-right: 15px;
			padding-bottom: 15px;
			flex-wrap: wrap;
		}
		&__tag{
			background-color: $dark-grey-color;
			padding: 3px;
			border-radius: 15px;
			padding-bottom: 8px;
			margin-left: 10px;
			margin-bottom: 10px;
			cursor: pointer;
		}
	}
</style>
