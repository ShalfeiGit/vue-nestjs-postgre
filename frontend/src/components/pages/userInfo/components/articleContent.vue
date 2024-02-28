<script setup lang="ts">
	import { computed, h, watch } from 'vue';
	import ArticleText from '@app/pages/userInfo/components/articleText.vue';
	import ArticleManage from '@app/pages/userInfo/components/articleManage.vue';
	import { PlusOutlined } from '@ant-design/icons-vue';
	import { useRoute, useRouter } from 'vue-router'
	import { useStore } from 'vuex'
	import { TableProps } from 'ant-design-vue';
	
	import { INotificationAction, IUserInfo } from '@app/store/modules/userInfo'
	import { IArticle, IPagnationMeta, IUserArticle } from '@app/store/modules/article';
	import { PaginationConfig } from 'ant-design-vue/es/pagination';

	interface IProps{
		openNotification: INotificationAction['openNotification'];
	}
	interface DataType {
		key: string;
		title: string;
		content: string[];
		tag: string;
		likes: number;
	}
	
	const props = defineProps<IProps>()
	const store = useStore()
	const route = useRoute()
	const router = useRouter()
	const userInfo = computed<IUserInfo>(() => store.getters["userInfo/getUserInfo"])
	const paginationInfo = computed<IPagnationMeta>(() => (store.getters["article/getUserArticles"].find(userArticle => userArticle?.username === route.params.username)?.articles?.meta ?? []))
	const data = computed<IUserArticle<IArticle>[]>(() => (store.getters["article/getUserArticles"].find(userArticle => userArticle?.username === route.params.username)?.articles?.items ?? []).map(article => ({
		key: `${article.id}`,
		...article
	})))	
	
	const handleAddArticle = () => {
		router.push({
      name: "createArticle"
    })
	}

	const handleEditArticle = (id) => () => {
		router.push({
      name: "editArticle",
			params: {
				slug: id
			}
    })
	}

	const handleViewArticle = (id) => () => {
		router.push({
      name: "previewArticle",
			params: {
				slug: id
			}
    })
	}

	const handleChangeArticlePagination = (page) =>{
		store.dispatch('article/loadUserArticlesAction', {username: route.params.username, page, limit: 10})
	}

	const handleRemoveArticle = (id) => () => {
		store.dispatch('article/deleteArticleAction', {
			articleId: id,
			navigate: router.push,
			openNotification: props.openNotification,
			username: route.params.username
		})
	}

	const columns: TableProps<DataType>['columns'] = [
		{
			title: 'Title',
			dataIndex: 'title',
			key: 'title',
		},
		{
			title: 'Content',
			dataIndex: 'content',
			key: 'content',
			customRender: ({value}) => h(ArticleText, {content: value})
		},
		{
			title: 'Tag',
			dataIndex: 'tag',	
			key: 'tag',
		},
		{
			title: 'Likes',
			dataIndex: 'likes',
			key: 'likes',
		},
		{
			title: 'Manage',
			dataIndex: 'manage',
			key: 'manage',
			width:' 18%',
			customRender: ({record}) => h(ArticleManage, {
				handleViewArticle: handleViewArticle(record?.key),
				handleEditArticle: handleEditArticle(record?.key),
				handleRemoveArticle: handleRemoveArticle(record?.key),
				userInfo,
				username: route.params.username,
				row: record
			})
		}
	]

	const pagination =  computed<PaginationConfig>(() => ({
		onChange: handleChangeArticlePagination,
		pageSize: paginationInfo.value?.itemsPerPage ?? 10,
		showSizeChanger: false,
		showQuickJumper: false,
		total: paginationInfo.value?.totalItems ?? 0,
		current: paginationInfo.value?.currentPage?? 1
	}
	)) 
	watch(() => route.params.username,
    async () => {
			if(userInfo.value?.username !== route.params.username){
				await store.dispatch('otherAuthorInfo/getOtherAuthorInfoAction', {username: route.params.username})
			} 
			await store.dispatch('article/loadUserArticlesAction', {username: route.params.username, page: 1, limit: 10})
    },
    {deep: true, immediate: true})
</script>

<template >
  <div class='article-content'>
		<div class='article-content__dashboard'>
			<a-button type="primary"  @click="handleAddArticle" >
				<template #icon><PlusOutlined /></template>
				Создать
			</a-button>
		</div>
		<a-table 
			class='article-content__table'
			:columns="columns" 
			:dataSource="data" 
			:pagination="pagination"
		/>
	</div>
</template>

<style lang="scss">
	@import '@app/app.scss';

	.article-content{
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		&__table{
			width: 100%;
		}
		&__manage{
			margin-right: 8px;
		}
		&__dashboard{
			width: 100%;
			display: flex;
			justify-content: flex-end;
			margin-bottom: 16px;
		}
	}
</style>
