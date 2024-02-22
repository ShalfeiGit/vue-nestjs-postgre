import type { IAxiosResponse, IInitialState } from '@app/store/store'
import { ICallNotificationAction, INavigateAction, INotificationAction } from '@app/shared/layout/types'
import { IAdditionalArticleInfo, IArticle, ILikeArticleResponse } from '@app/store/modules/article'
import api from '@app/api/api'

export interface IUserInfo {
	id: number;
	username: string;
	email: string;
  bio: string;
  age: number;
	gender: string;
	createdAt: number;
	updatedAt: number;
	refresh_token?: string;
	imageUrl: string;
	avatarUrl: string;
	likedArticle: IArticle[];
}

export interface ISignIn {
	username?: string
	pass?: string
	remember?: boolean
	refresh_token?: string;
}

export interface ISignUp {
	username: string
	email: string
	pass: string
}

export interface IFormData {
	formData: FormData
	cb?(): void,
}

export interface ISignInResponse extends IUserInfo {
	refresh_token: string;
}

const moduleUserInfo = {
	namespaced: true,
	state: (): IInitialState<IUserInfo> => ({
		data: null,
		error: null,
		loading: false,
		status: null,
		statusText: null,
		headers: null,
		config: null,
	}),
	mutations: { 
		updateUserInfoAction_pending (state) {
			state.loading = true
		},
		updateUserInfoAction_fulfilled (state, payload) {
			const {data, status, statusText, headers, config}  = <IAxiosResponse<IUserInfo>>payload ?? {}
			state.data = data
			state.error = null
			state.status = status
			state.statusText = statusText
			state.headers = headers
			state.config = config
			state.loading = false
		},
		updateUserInfoAction_rejected (state, payload) {
			const {data, status, statusText, headers, config}  = <IAxiosResponse<IUserInfo>>payload ?? {}
			state.data = null
			state.error = data as unknown as string
			state.status = status
			state.statusText = statusText
			state.headers = headers
			state.config = config 
			state.loading = false
		},
		signInAction_pending (state) {
			state.loading = true
		},
		signInAction_fulfilled (state, payload) {
			const {data, status, statusText, headers, config}  = <IAxiosResponse<IUserInfo>>payload ?? {}
			const {refresh_token, ...updatedDate}  = data
			state.data = updatedDate
			state.error = null
			state.status = status
			state.statusText = statusText
			state.headers = headers
			state.config = config
			state.loading = false
		},
		signInAction_rejected (state, payload) {
			const {data, status, statusText, headers, config}  = <IAxiosResponse<IUserInfo>>payload ?? {}
			state.data = null
			state.error = data  as unknown as string
			state.status = status
			state.statusText = statusText
			state.headers = headers
			state.config = config 
			state.loading = false
		},
		signUpAction_pending (state) {
			state.loading = true
		},
		signUpAction_fulfilled (state, payload) {
			state.loading = false
		},
		signUpAction_rejected (state, payload) {
			state.loading = false
		},
		resetUserInfoAction_fulfilled(state, payload) {
			state.data = null
			state.error = null
			state.loading = false
			state.status = null
			state.statusText = null
			state.headers = null
			state.config = null
		},
		deleteUserInfoAction_fulfilled(state, payload) {
			state.data = null
			state.error = null
			state.loading = false
			state.status = null
			state.statusText = null
			state.headers = null
			state.config = null
		},
		likeArticleAction_fulfilled(state, payload) {
			const {user}  = <IAxiosResponse<IArticle> & IAdditionalArticleInfo & ILikeArticleResponse>payload ?? {}
			state.data = user
			state.error = null
			state.loading = false
		},
		
	},
	actions: { 
		async updateUserInfoAction({ commit, dispatch }, payload: IUserInfo & IFormData & INotificationAction & INavigateAction){
			const {openNotification, navigate, formData, ...userInfo} = payload
			const callNotification = ({type, message}: ICallNotificationAction ) => {
				openNotification({
					content: message,
					type
				})
			}
			const {username, ...dataUserInfo} = userInfo
			const response: IAxiosResponse<IUserInfo> = await api({ method: 'put', url: `user/${username}`, data: formData, headers: { 'Content-Type': 'multipart/form-data'} })
			callNotification({
				type: response.status >= 400 ? 'error' : 'success',
				message: response.status >= 400 ? response.data as unknown as string : `${response.data.username} was updated`
			})
			if(response.status >= 400){
				return commit('updateUserInfoAction_rejected', response)
			}	
			return commit('updateUserInfoAction_fulfilled', response)
	 	},

		async savePreviewUserAvatarAction({ commit, dispatch }, payload: Pick<IUserInfo, 'username'> & IFormData){
			const {formData, username, cb} = payload
			const response: IAxiosResponse<IUserInfo> = await api({ method: 'put', url: `user/${username}/avatar`, data: formData, headers: { 'Content-Type': 'multipart/form-data'} })
			if(response.status >= 400){
				return commit('savePreviewUserAvatarAction_rejected', response)
			}	
			if(cb){
				cb()
			}
			return commit('savePreviewUserAvatarAction_fulfilled', response)
	 	},
			
		async deletePreviewUserAvatarAction({ commit, dispatch }, payload: Pick<IUserInfo, 'username'> & {formData}){
			const {formData,   ...userInfo } = payload
			const response = await api({ method: 'delete', url: `user/${userInfo?.username}/avatar` , data: formData, headers: {  'Content-Type': 'multipart/form-data' } })
			return commit('deletePreviewUserAvatarAction_fulfilled', response)
	 	},

		async signInAction({ commit, dispatch }, payload: ISignIn & INotificationAction & INavigateAction){
			const { openNotification, navigate, ...userInfo} = payload
			// const callNotification = ({type, message}: ICallNotificationAction ) => {
			// 	openNotification({
			// 		content: message,
			// 		type
			// 	})
			// }
			const response = await api({ method: 'post', url: 'auth', data: userInfo })
			// if(response.status >= 400){
			// 	callNotification({
			// 		type: 'error',
			// 		message: response.data.message
			// 	})
			// 	return commit('signInAction_rejected', response) 
			// }	else {
			// 	if(navigate){
			// 		navigate('/si')
			// 	}
			// }
			if(response?.data?.refresh_token){
				localStorage.setItem('refresh_token', response.data.refresh_token)
			}
			return commit('signInAction_fulfilled', response)
	 	},

		async signUpAction({ commit, dispatch }, payload: ISignUp & INotificationAction & INavigateAction){
			const {openNotification, navigate, ...userInfo} = payload
			const callNotification = ({type, message}: ICallNotificationAction ) => {
				openNotification({
					content: message,
					type
				})
			}
			const response = await api({ method: 'post', url: 'user', data: userInfo })
			callNotification({
				type: response.status >= 400 ? 'error' : 'success',
				message: response.status >= 400 ? response.data.message : `${userInfo.username} was created`
			})
			if(response.status >= 400){
				return commit('signUpAction_rejected', response)
			}	else {
				navigate('/signIn')
			}
			return commit('signUpAction_fulfilled', response)
	 		},

		async resetUserInfoAction({ commit, dispatch }, payload: INavigateAction){
			const { navigate } = payload
			navigate('/')
			localStorage.clear()
	 	},

		async deleteUserInfoAction({ commit, dispatch }, payload: Pick<IUserInfo, 'username'> & INavigateAction){
			const { navigate, ...userInfo } = payload
			const response = await api({ method: 'delete', url: `user/${userInfo?.username}` })
			if(response.status >= 400){
				return commit('deleteUserInfoAction_rejected', response)
			}	else {
				navigate('/')
				localStorage.clear()
			}
			return commit('deleteUserInfoAction_fulfilled', response)
		},

		async likeArticleByUserAction({ commit, dispatch }, payload: IAxiosResponse<IArticle> & IAdditionalArticleInfo & ILikeArticleResponse){
			const {user} = payload
			return commit('likeArticleByUserAction_fulfilled', user)
 		},
	},
	getters: { 
		getUserInfo: (state) => {
			return state?.data
		}
	}
}
export default moduleUserInfo
