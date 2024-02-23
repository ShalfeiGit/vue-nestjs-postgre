import { createRouter, createWebHistory } from 'vue-router'

import Layout from '@app/shared/layout/Layout.vue'
import Home from '@app/pages/home/Home.vue'
import Article from '@app/pages/article/Article.vue'
import PreviewArticle from '@app/pages/previewArticle/PreviewArticle.vue'
import ErrorPage from '@app/shared/error/ErrorPage.vue'
import SignIn from '@app/pages/signIn/SignIn.vue'
import SingUp from '@app/pages/signUp/SignUp.vue'
import UserInfo from '@app/pages/userInfo/UserInfo.vue'

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			component: Layout,
			children: [
				{
					name: 'home',
					path: '',
					component: Home,
				},
				{
					name: 'showArticle',
					path: 'article/:id',
					component: Article
				},
				{
					name: 'preview',
					path: 'preview/:id',
					component: PreviewArticle
				},
				{
					name:'signIn',
					path:'signIn',
					component: SignIn
				},
				{
					name:'signUp',
					path:'signUp',
					component: SingUp
				},
				{
					name: 'editArticle',
					path: 'article/edit/:slug',
					component: Article
				},
				{
					name: 'previewArticle',
					path: 'article/preview/:slug',
					component: PreviewArticle
				},
				{
					name: 'createArticle',
					path: 'article/create',
					component: Article
				},
				{
					name: 'userInfo',
					path: 'userinfo/:username',
					component: UserInfo
				},
				{ 
					name: 'error',
					path: '/:pathMatch(.*)*',
					component: ErrorPage
				}
			]
		}
	],
})

export default router