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
					path: '',
					component: Home,
				},
				{
					path: 'article/:id',
					component: Article
				},
				{
					path: 'preview/:id',
					component: PreviewArticle
				},
				{
					path: 'signin',
					component: SignIn
				},
				{
					path: 'signup',
					component: SingUp
				},
				{
					path: 'article/edit/:slug',
					component: Article
				},
				{
					path: 'article/preview/:slug',
					component: PreviewArticle
				},
				{
					path: 'article/create',
					component: Article
				},
				{
					path: 'userinfo/:username',
					component: UserInfo
				},
				{ 
					path: '/:pathMatch(.*)*',
					component: ErrorPage
				}
			]
		}
	],
})

export default router