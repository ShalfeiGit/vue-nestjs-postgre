

<script setup lang="ts" >
	import { ref } from 'vue';
	import { TabsProps } from 'antd'
	import { useRouter, useRoute } from 'vue-router'
	import { h } from 'vue'

	import AppMessage from '@app/shared/message/Message.vue'

	const router = useRouter()
	const route = useRoute()
  const tabQuery = ref('user-content');		
	const tabs = ref<TabsProps['items']>([
		{
			key: 'user-content',
			label: 'User Info',
			children: h(AppMessage, { message: 'User content'}),
		},
		{
			key: 'articles-content',
			label: 'Articles Info',
			children: h(AppMessage, { message: 'Articles content'}),
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
		<a-tab-pane v-for="tab in tabs" :key="tab.key" :destroyInactiveTabPane="true" :tab="tab.label" ><component :is="tab.children"></component></a-tab-pane>
	</a-tabs>
	</div>
</template>

<style lang="scss">
	@import '@app/app.scss';

	.user-content{
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		& form {
			width: 100%;
			max-width: 800px;
		}
		& h1{
			display: flex;
			justify-content: center;
		}
		&__link-title{
			color: $blue-color;
			text-decoration: none;
			font-size: 16px;
		}

		&__upload{
			display: flex;
			flex-direction: column;
		}
		&__avatar{
			display: flex;
			justify-content: center;
		}
	}

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

	.user-info{
		display: flex;
		justify-content: center;
		width: 100%;
		&__tabs{
			width: 50%;
		}
	}
</style>



<!-- import React, { useEffect, useState }from 'react'
import { useSelector } from 'react-redux'
import { Input, Typography, Tabs, TabsProps } from 'antd'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import queryString from 'query-string'

import '@app/pages/userInfo/userInfo.scss'
import { RootState } from '@app/store/store'
import UserContent from './components/userContent'
import ArticlesContent from './components/articleContent'
import { INotificationAction } from '@app/shared/layout/types'

const { TextArea } = Input

const { Title } = Typography

const formItemLayout = {
	labelCol: {
		xs: { span: 24 },
		sm: { span: 4 }
	},
	wrapperCol: {
		xs: { span: 24 },
		sm: { span: 16 }
	}
}

const tailFormItemLayout = {
	wrapperCol: {
		xs: {
			span: 24,
			offset: 0
		},
		sm: {
			span: 16,
			offset: 4
		}
	}
}

const UserInfo: React.FC = () => {
	const navigate = useNavigate()
	const {username} = useParams()
	const openNotification = useOutletContext()
	const [tabQuery, setTabQuery]  = useState('')
	const userInfo = useSelector((state: RootState) => state.userInfo.data)
	const tabs: TabsProps['items'] = [
		{
			key: 'user-content',
			label: 'User Info',
			children: <UserContent /> ,
		},
		{
			key: 'articles-content',
			label: 'Articles Info',
			children: <ArticlesContent openNotification={openNotification as INotificationAction['openNotification']}/>,
		}
	]

	useEffect(() => {
		const { tab } = queryString.parse(window.location.search)
		const currentTab = tab ? `${tab}` : 'user-content'
		setTabQuery(currentTab)
		if(username){
			navigate(`/userinfo/${username}?${queryString.stringify({ tab: currentTab})}`)
		}
	}, [userInfo?.username]) 

	const onChange = (key: string) => {
		setTabQuery(key)
		navigate(`/userinfo/${username}?${queryString.stringify({ tab: key})}`)
	}

	return ( 
		<div className="user-info">
			<Tabs 
				className={'user-info__tabs'}
				defaultActiveKey="user-content"
				items={tabs}
				activeKey={tabQuery}
				onChange={onChange}
			/>
		</div>
	)
}

export default UserInfo -->
