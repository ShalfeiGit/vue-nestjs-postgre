import type { IAxiosResponse, IInitialState } from '@app/store/store'
import api from '@app/api/api'
import { INavigateAction, INotificationAction, IUserInfo } from '@app/store/modules/userInfo'

export interface IOtherAuthorInfo {
	username: string;
	email: string;
  bio: string;
  age: number;
	gender: string;
	avatarUrl: string;
}

const moduleOtherAuthorInfo = {
	namespaced: true,
	state: (): IInitialState<IOtherAuthorInfo> => ({
		data: null,
		error: null,
		loading: false,
		status: null,
		statusText: null,
		headers: null,
		config: null,
	}),
	mutations: { 
		getOtherAuthorInfoAction_pending (state) {
			state.loading = true
		},
		getOtherAuthorInfoAction_fulfilled (state, payload) {
			const {data, status, statusText, headers, config}  = <IAxiosResponse<IOtherAuthorInfo>>payload ?? {}
			state.data = data
			state.error = null
			state.status = status
			state.statusText = statusText
			state.headers = headers
			state.config = config
			state.loading = false
		},
		getOtherAuthorInfoAction_rejected (state, payload) {
			const {data, status, statusText, headers, config}  = <IAxiosResponse<IOtherAuthorInfo>>payload ?? {}
			state.data = null
			state.error = data as unknown as string
			state.status = status
			state.statusText = statusText
			state.headers = headers
			state.config = config 
			state.loading = false
		}, 
	},
	actions: {
		async getOtherAuthorInfoAction({ commit, dispatch }, payload: Pick<IOtherAuthorInfo, 'username'> & INotificationAction & INavigateAction){
			const { username } = payload	
			const response: IAxiosResponse<IUserInfo> = await api({ method: 'get', url: `user/author/${username}` })
			if(response.status >= 400){
				return commit('getOtherAuthorInfoAction_rejected', response)
			}	
			return commit('getOtherAuthorInfoAction_fulfilled', response)
		}
	},
	// getters: { ... }
}

export default moduleOtherAuthorInfo