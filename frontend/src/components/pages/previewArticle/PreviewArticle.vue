<script setup lang="ts" >
	import { IArticle } from '@app/store/modules/article';
	import { computed, onMounted } from 'vue';
	import { useRoute } from 'vue-router'
	import { useStore } from 'vuex'
	import moment from 'moment'

	const route = useRoute()
	const store = useStore()
	const article = computed<IArticle>(() => store.getters["article/getArticleInfo"])		
	onMounted(() => {
		if(route.params.slug) {
			store.dispatch('article/loadArticleAction', { articleId: route.params.slug })
		}
	})
</script>

<template >
  <div class="preview-article">
			<a-row justify="start">
				<a-col :span="6"></a-col>
				<a-col :span="12">
					<div class="preview-article__meta">
						<div  class="preview-article__meta-block">
							<div class="preview-article__avatar">
								<a-avatar shape="circle" :src="article?.user?.avatarUrl
									? `http://localhost:3000${article?.user?.avatarUrl}` 
									: `https://api.dicebear.com/7.x/miniavs/svg?seed=${article?.user?.id}`"
								/>
							</div>
						</div>
						<div class="preview-article__meta-block">
							<div v-if="article?.user" class="preview-article__author">
								<router-link :to="{ name: 'userInfo', params: { username: article?.user?.username }, query: {tab: 'user-content'}}">
									{{article?.user?.username}}
								</router-link>
							</div>
							<a-typography-text type="secondary">
								Date: {{`${moment(article?.updatedAt ?? article?.createdAt).format('MMMM DD YYYY')}`}},
							</a-typography-text>
							<a-typography-text type="secondary">{{' '}}Tag: {{article?.tag}}</a-typography-text> 
						</div>
					</div>
					<div class="preview-article__title">
						<a-typography-title>{{article?.title}}</a-typography-title>
					</div>
					<div class="preview-article__content">
						<p v-for="paragraph, i in article?.content" :key="i">{{paragraph}}</p>
					</div>
				</a-col>
				<a-col :span="6"></a-col>
			</a-row>
		</div>
</template>

<style lang="scss">
	.preview-article{
		& h1{
			padding-top: 20px;
			font-size: 40px;
		}
		&__meta{
			display: flex;
			justify-content: flex-start;
			align-items: center;
		}
		&__meta-block{
			margin-right: 10px;
		}
		&__title{
			display: flex;
			justify-content: center;
		}
		&__content p{
			line-height: 1.3;
		}
	}
</style>

