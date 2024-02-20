import { createStore } from 'vuex'
import { AxiosResponseHeaders, InternalAxiosRequestConfig, RawAxiosResponseHeaders } from 'axios'

import moduleArticle from '@app/store/modules/article'
import moduleOtherAuthorInfo from '@app/store/modules/otherAuthorInfo'
import moduleUserInfo from '@app/store/modules/userInfo'

export type AppDispatch = typeof store.dispatch
export interface IAxiosResponse<T> {
	data: T
	status: number
	statusText: string
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders
  config: InternalAxiosRequestConfig<T>
}

export interface IAxiosErrorResponse {
	statusText: string
	data: {message: string}
	statusCode: number;
}

export interface IInitialState<T> extends IAxiosResponse<T> {
	error: string
	loading: boolean
}

const store = createStore({
	modules: {
		article: moduleArticle,
		otherAuthorInfo: moduleOtherAuthorInfo,
		userInfo: moduleUserInfo,
	}
})
export default store