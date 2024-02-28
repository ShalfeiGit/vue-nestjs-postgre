<script setup lang="ts">
	import { IUserInfo } from '@app/store/modules/userInfo';
  import { computed } from 'vue';
  import { useStore } from 'vuex';
	import { useRouter } from 'vue-router';
	import { StarOutlined } from '@ant-design/icons-vue';
	export interface IFeedArticle {
		articleId: number;
		authorName: string;
		authorId: number;
		authorAvatar: string;
		createdAt: string;
		title: string;
		content: string[];	
		likes: number;
		liked: boolean;
	}
	export interface IFeedPagination {
		totalItems: number;
		itemsPerPage: number;
		currentPage: number;	
	}

	interface IProps{
		feedArticles: IFeedArticle[];
		pagination: IFeedPagination;
		tag: string;
	}
	const props = defineProps<IProps>()
	const store = useStore()
	const router = useRouter()
	const userInfo = computed<IUserInfo>(() => store.getters["userInfo/getUserInfo"])

	const handlePaginationFeeds = (page) => {
		props.tag === 'global' 
			? store.dispatch('article/loadAllArticlesAction', {page, limit: props.pagination.itemsPerPage}) 
			: store.dispatch('article/loadGroupArticlesAction', {tag: props.tag, page, limit: props.pagination.itemsPerPage})
	}
	const handleReadArticle = (slug) => {
		router.push({
      name: "previewArticle",
			params: {
        slug
      },
    })
	}
	const handleLikeArticle = (feedArticle) => {
		if(!userInfo) return
		const m = (userInfo.value?.likedArticle ?? []).some(article => `${article.id}` === `${feedArticle?.articleId}`) 
		const m1 = userInfo.value?.likedArticle 
		const m2 = feedArticle?.articleId

		const likes = (userInfo.value?.likedArticle ?? []).some(article => `${article.id}` === `${feedArticle?.articleId}`) 
			? feedArticle?.likes - 1
			: feedArticle?.likes + 1
		store.dispatch('article/likeArticleAction', {
			username: userInfo.value?.username,
			articleId: feedArticle?.articleId,
			likes,
			tag: props.tag,
			page: props.pagination.currentPage,
			limit: props.pagination.itemsPerPage
		})
	}
</script>

<template>
	<div class='feed-articles'>
		<div v-for="feedArticle, i in props.feedArticles" :key="i" class='feed-articles__item'>
			<div class='feed-articles__header'>
				<div class='feed-articles__userinfo'>
					<div>
						<a-avatar shape="circle" :src="feedArticle?.authorAvatar
							? `http://localhost:3000${feedArticle?.authorAvatar}` 
							: `https://api.dicebear.com/7.x/miniavs/svg?seed=${feedArticle?.authorId}`"
						/>
					</div>
					<div class='feed-articles__userinfo-content'>
						<router-link :to="{ name: 'userInfo', params: { username: feedArticle?.authorName }, query: {tab: 'user-content'}}">
							{{feedArticle.authorName}}
						</router-link>
						<a-typography-text type="secondary" >Date: {{feedArticle?.createdAt}}</a-typography-text>
					</div>
				</div>
				<a-button :disabled="!userInfo" @click="handleLikeArticle(feedArticle)">
					<span :class="`feed-articles__stars${feedArticle?.liked ? '_liked' : '' }`">
						<a-space>
							<StarOutlined />
							{{`${feedArticle.likes}`}}
						</a-space>
					</span>
				</a-button>
			</div>
			<a-typography-title :level="4">{{feedArticle?.title}}</a-typography-title>
			<div class='feed-articles__article'>
				<div class='feed-articles__article_gradient'></div>
				<a-typography-text v-for="text, i in feedArticle.content">
					<p class='feed-articles__article_text' :key="i">{{text}}</p>
				</a-typography-text>
			</div>
			<a-button class='feed-articles__read-more' type="text" @click="handleReadArticle(feedArticle.articleId)">
				Read more...
			</a-button>
			<a-divider />
		</div>
		<div class='feed-articles__pagination'>
			<div v-if="feedArticles.length > 0">
				<a-pagination :current="pagination.currentPage" @change="handlePaginationFeeds" :total="pagination.totalItems" /></div>
			<div v-else="">
				<a-typography-title :level="4">Не найдены статьи по данной тематике</a-typography-title>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
	@import '@app/app.scss';

	.feed-articles{
		&__header{
			display: flex;
			flex-direction: row;
			justify-content: space-between;
		}
		&__stars_liked{
			border: 1px $blue-color solid;
			border-radius: 5px;
			padding-left: 4px;
			padding-right: 4px;
			padding-bottom: 1px;
			color: $blue-color;
		}
		&__userinfo{
			display: flex;
			flex-direction: row;
			align-items: center;
	
			&-content{
				margin-left: 8px;
				display: flex;
				flex-direction: column;
				& h5{
					margin-bottom: 0;
				}
			}
		}
		&__article{
			max-height: 150px;
			overflow: hidden;
			position: relative;
		}
		&__pagination{
			display: flex;
			justify-content: center;
		}
		&__article_gradient{
			position: absolute;
			width: 100%;
			height: 100%;
			background: linear-gradient(transparent, white);
		}
		&__read-more{
			color: $blue-color !important;
		}
		&__article_text{
			text-indent: 20px
		}
		&__grade{
			cursor: pointer
		}
	}
</style>

