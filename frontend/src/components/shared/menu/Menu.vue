<template >
	<div class="menu">
		<a-row justify="end">
			<a-col :span="1"></a-col>
			<a-col :span="3">
				<a-button class="menu__button" type="link" @click="handleRedirectHome" >
					<app-rocket-two-tone ></app-rocket-two-tone>
					<a-typography-text>Startup</a-typography-text>
				</a-button>
			</a-col>
			<a-col :span="5"></a-col>
			<a-col :span="3"></a-col>
			<a-col :span="3"></a-col>
			<a-col :span="9" class="menu__login">
				<div v-if="userInfo">
					<a-button class="menu__button" type="link" title="User info" @click="handleRedirectUserInfoModal(userInfo?.username)">
						<a-avatar :src="avatarSrc" 
						/><span class="menu__greetings">{{`Hi, ${userInfo?.username}`}}</span>
					</a-button>
				</div>
				<div v-else>
					<a-button class="menu__button" type="link" title="Sign in" @click="handleRedirectSignInModal">
							<app-login-outlined />
						</a-button>
				</div>
			</a-col>
		</a-row>
	</div>
</template>

<script setup >
	import { LoginOutlined as AppLoginOutlined, RocketTwoTone as AppRocketTwoTone } from '@ant-design/icons-vue';
	import {computed, onMounted, defineProps, ref } from 'vue';
	import { useRouter } from 'vue-router'
	import { useStore } from 'vuex'

	const props = defineProps({
		openNotification: Function
	});
	const store = useStore()
	const router = useRouter()

	const userInfo = computed(() => store.getters["userInfo/getUserInfo"])
	const avatarSrc = computed(() => userInfo?.avatarUrl 
		? `http://localhost:3000${userInfo?.avatarUrl}` 
		: `https://api.dicebear.com/7.x/miniavs/svg?seed=${userInfo?.id}`
	)

	const handleRedirectHome = () => {
		router.push({
      name: "home"
    })
	}
	const handleRedirectSignInModal = () => {
		router.push({
      name: "signin"
    })
	}
	const handleRedirectUserInfoModal = (username) => () => {
		router.push({
      name: "userInfo",
			params: {
        username
      },
			query: {
				tab: 'user-content'
			}
    })
	}
	
	onMounted(() => {
		const refresh_token = localStorage.getItem('refresh_token')
		if(!userInfo?.id && refresh_token){
			store.dispatch('userInfo/signInAction', { 
				openNotification: props.openNotification,
				navigate: router.push,
				refresh_token
			})
		}
	})

</script>

<style lang="scss">
	@import '@app/app.scss';

	.menu{
		font-weight: bold;
		margin-top: 30px;
		margin-bottom: 40px;
		font-size: 22px;
		&__button, &__button .ant-typography{
			font-weight: bold;
			font-size: 22px;
			padding-left: 0px;
			color: $blue-color;
		}
		&__login{
			display: flex;
			justify-content: flex-end;
		}
		&__greetings{
			font-size: 12px;
			margin-left: 16px;
		}
	}
</style>
