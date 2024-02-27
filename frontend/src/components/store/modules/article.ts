import { ICallNotificationAction, IUserInfo } from '@app/store/modules/userInfo'
import type { IAxiosErrorResponse, IAxiosResponse, IInitialState } from '@app/store/store'
import api from '@app/api/api'

export interface IFeedArticles {
	articleId: string,
	authorName: string,
	authorAvatar: string,
	createdAt: number,
	title: string,
	content: string[],
	likes: number,
	liked: boolean,
}
export interface IPagination {
	totalItems: number,
	itemsPerPage: number,
	currentPage: number,
}

export interface IFeeds {
	tabName: string;
	id: string;
  pagination: IPagination;
	feedArticles: IFeedArticles[]
}

export interface ITagOption {
	label: string;
	value: string;
}

export interface IArticle {
	id: number;
  title: string;
  content: string[];
  tag: string
  updatedAt: number;
 	createdAt: number;
  likes: number;
  user: Pick<IUserInfo, 'username' | 'id' | 'avatarUrl'>;
}

export interface IPagnationMeta {
	currentPage: number,
	itemCount: number,
	itemsPerPage: number,
	totalItems: number,
	totalPages: number,
}
export interface IPaginatedResponse <T>{
	items: T[],
	meta: IPagnationMeta,
}

export interface IArticleRequestData {
	articleId?: string;
	tag?: string;
	username?: string;
}

export interface ILikeArticleResponse {
	user: IUserInfo
	groupArticles: IPaginatedResponse<IArticle>
}

export interface IGroupArticle<T> {
	tag: string,
	articles: IPaginatedResponse<IArticle>
}

export interface IUserArticle<T> {
	username: string,
	articles: IPaginatedResponse<IArticle>
}

export interface IAdditionalArticleInfo {
	tags: ITagOption[],
	groupArticles: IGroupArticle<IArticle>[],
	userArticles: IUserArticle<IArticle>[],
}

export interface IPaginationInfo {
	page: number,
  limit: number,
}

const initialState: IInitialState<IArticle | ITagOption[] | IGroupArticle<IArticle> | IUserArticle<IArticle>> & IAdditionalArticleInfo = {
	data: null,
	tags: null,
	groupArticles: [],
	userArticles: [],
	error: null,
	loading: false,
	status: null,
	statusText: null,
	headers: null,
	config: null,
}

const moduleArticle = {
	namespaced: true,
	state: (): IInitialState<IArticle | ITagOption[] | IGroupArticle<IArticle> | IUserArticle<IArticle>> & IAdditionalArticleInfo => ({
		data: null,
		tags: null,
		groupArticles: [],
		userArticles: [],
		error: null,
		loading: false,
		status: null,
		statusText: null,
		headers: null,
		config: null,
	}),
	mutations: { 
		loadArticleAction_pending (state) {
			state.loading = true
		},
		loadArticleAction_fulfilled (state, payload) {
			const {data, status, statusText, headers, config}  = <IAxiosResponse<IArticle>>payload ?? {}
			state.data = {...data,
				content: `${data?.content}`.split(/\r\n|\n/g)},
			state.error = null
			state.status = status
			state.statusText = statusText
			state.headers = headers
			state.config = config
			state.loading = false
		},
		loadArticleAction_rejected (state, payload) {
			const {data, status, statusText, headers, config}  = <IAxiosResponse<IArticle>>payload ?? {}
			state.data = null
			state.error = data as unknown as string
			state.status = status
			state.statusText = statusText
			state.headers = headers
			state.config = config 
			state.loading = false
		},
		loadAllArticlesAction_pending (state) {
			state.loading = true
		},
		loadAllArticlesAction_fulfilled (state, payload) {
			const {data, status, statusText, headers, config}  = <IAxiosResponse<IGroupArticle<IArticle>>>payload ?? {}
			state.groupArticles = [
				...(state.groupArticles ?? []).filter(groupArticle => groupArticle.tag !== data.tag),
				{
					tag: data.tag,
					articles: 	{
						items: (data?.articles?.items ?? []).map(article => ({
							...article, 
							content: `${article?.content}`.split(/\r\n|\n/g)
						})),
						meta: data?.articles?.meta,
					}
				}],
			state.error = null
			state.status = status
			state.statusText = statusText
			state.headers = headers
			state.config = config
			state.loading = false
		},
		loadAllArticlesAction_rejected (state, payload) {
			const {data, status, statusText, headers, config}  = <IAxiosResponse<IGroupArticle<IArticle>>>payload ?? {}
			state.groupArticles = null
			state.error = data as unknown as string
			state.status = status
			state.statusText = statusText
			state.headers = headers
			state.config = config 
			state.loading = false
		},
		loadGroupArticlesAction_pending (state) {
			state.loading = true
		},
		loadGroupArticlesAction_fulfilled (state, payload) {
			const {data, status, statusText, headers, config}  = <IAxiosResponse<IGroupArticle<IArticle>>>payload ?? {}
			state.groupArticles = [
				...(state.groupArticles ?? []).filter(groupArticle => groupArticle.tag !== data.tag),
				{
					tag: data.tag,
					articles: 	{
						items: (data?.articles?.items ?? []).map(article => ({
							...article, 
							content: `${article?.content}`.split(/\r\n|\n/g)
						})),
						meta: data?.articles?.meta,
					}
				}],
			state.error = null
			state.status = status
			state.statusText = statusText
			state.headers = headers
			state.config = config
			state.loading = false
		},
		loadGroupArticlesAction_rejected (state, payload) {
			const {data, status, statusText, headers, config}  = <IAxiosResponse<IGroupArticle<IArticle>>>payload ?? {}
			state.groupArticles = null
			state.error = data as unknown as string
			state.status = status
			state.statusText = statusText
			state.headers = headers
			state.config = config 
			state.loading = false
		},
		removeGroupArticlesAction_fulfilled (state, payload) {
			const { tag }  = <IArticleRequestData>payload ?? {}
			state.groupArticles = [
				...(state.groupArticles ?? []).filter(groupArticle => groupArticle.tag !== tag),
			]
		},
		loadUserArticlesAction_pending (state) {
			state.loading = true
		},
		loadUserArticlesAction_fulfilled (state, payload) {
			const {data, status, statusText, headers, config}  = <IAxiosResponse<IUserArticle<IArticle>>>payload ?? {}
			state.userArticles = [
				...(state.userArticles ?? []).filter(userArticle => userArticle.username !== data.username),
				{
					username: data.username,
					articles: 	{
						items: (data?.articles?.items ?? []).map(article => ({
							...article, 
							content: `${article?.content}`.split(/\r\n|\n/g)
						})),
						meta: data?.articles?.meta,
					}
				}],
			state.error = null
			state.status = status
			state.statusText = statusText
			state.headers = headers
			state.config = config
			state.loading = false
		},
		loadUserArticlesAction_rejected (state, payload) {
			const {data, status, statusText, headers, config}  = <IAxiosResponse<IUserArticle<IArticle>>>payload ?? {}
			state.userArticles = null
			state.error = data as unknown as string
			state.status = status
			state.statusText = statusText
			state.headers = headers
			state.config = config 
			state.loading = false
		},
		loadTagOptionsAction_pending (state) {
			state.loading = true
		},
		loadTagOptionsAction_fulfilled (state, payload) {
			const {data, status, statusText, headers, config }  = <IAxiosResponse<ITagOption[]>>payload ?? {}
			state.tags = data
			state.error = null
			state.status = status
			state.statusText = statusText
			state.headers = headers
			state.config = config
			state.loading = false
		},
		loadTagOptionsAction_rejected (state, payload) {
			const {data, status, statusText, headers, config }  = <IAxiosResponse<ITagOption[]>>payload ?? {}
			state.tags = null
			state.error = data as unknown as string
			state.loading = true
			state.status = status
			state.statusText = statusText
			state.headers = headers
			state.config = config
		},
		createArticleAction_pending (state) {
			state.loading = true
		},
		createArticleAction_fulfilled (state, payload) {
			const {data, status, statusText, headers, config}  = <IAxiosResponse<IArticle> & IAdditionalArticleInfo>payload ?? {}
			state.data =  {...data,
				content: `${data?.content}`.split(/\r\n|\n/g)}
			state.error = null
			state.status = status
			state.statusText = statusText
			state.headers = headers
			state.config = config
			state.loading = false
		},
		createArticleAction_rejected (state, payload) {
			const {data, status, statusText, headers, config}  = <IAxiosResponse<IArticle> & IAdditionalArticleInfo>payload ?? {}
			state.data = null
			state.error = data as unknown as string
			state.status = status
			state.statusText = statusText
			state.headers = headers
			state.config = config 
			state.loading = false
		},
		updateArticleAction_pending (state) {
			state.loading = true
		},
		updateArticleAction_fulfilled (state, payload) {
			const {data, status, statusText, headers, config}  = <IAxiosResponse<IArticle> & IAdditionalArticleInfo>payload ?? {}
			state.data = {...data,
				content: `${data?.content}`.split(/\r\n|\n/g)}
			state.error = null
			state.status = status
			state.statusText = statusText
			state.headers = headers
			state.config = config
			state.loading = false
		},
		updateArticleAction_rejected (state, payload) {
			const {data, status, statusText, headers, config}  = <IAxiosResponse<IArticle> & IAdditionalArticleInfo>payload ?? {}
			state.tags = null
			state.error = data as unknown as string
			state.status = status
			state.statusText = statusText
			state.headers = headers
			state.config = config 
			state.loading = false
		},
		deleteArticleAction_pending (state) {
			state.loading = true
		},
		deleteArticleAction_fulfilled (state, payload) {
			const {data, status, statusText, headers, config}  = <IAxiosResponse<IUserArticle<IArticle>>>payload ?? {}
			state.data = null
			state.userArticles = [
				...(state.userArticles ?? []).filter(userArticle => userArticle.username !== data.username),
				{
					username: data.username,
					articles: 	{
						items: (data?.articles?.items ?? []).map(article => ({
							...article, 
							content: `${article?.content}`.split(/\r\n|\n/g)
						})),
						meta: data?.articles?.meta,
					}
				}],
			state.error = null
			state.status = status
			state.statusText = statusText
			state.headers = headers
			state.config = config
			state.loading = false
		},
		deleteArticleAction_rejected (state, payload) {
			const {data, status, statusText, headers, config}  = <IAxiosResponse<IArticle> & IAdditionalArticleInfo>payload ?? {}
			state.data = null
			state.error = data as unknown as string
			state.status = status
			state.statusText = statusText
			state.headers = headers
			state.config = config 
			state.loading = false
		},
		likeArticleAction_pending (state) {
			state.loading = true
		},
		likeArticleAction_fulfilled (state, payload) {
			const {data, status, statusText, headers, config}  = <IAxiosResponse<IGroupArticle<IArticle>>>payload ?? {}
			state.error = null
			state.groupArticles = [
				...(state.groupArticles ?? []).filter(groupArticle => groupArticle.tag !== data.tag),
				{
					tag: data.tag,
					articles: 	{
						items: (data?.articles?.items ?? []).map(article => ({
							...article, 
							content: `${article?.content}`.split(/\r\n|\n/g)
						})),
						meta: data?.articles?.meta,
					}
				}],
			state.status = status
			state.statusText = statusText
			state.headers = headers
			state.config = config
			state.loading = false
		},
		likeArticleAction_rejected (state, payload) {
			const {data, status, statusText, headers, config}  = <IAxiosResponse<IGroupArticle<IArticle>>>payload ?? {}
			state.groupArticles = []
			state.error = data as unknown as string
			state.status = status
			state.statusText = statusText
			state.headers = headers
			state.config = config 
			state.loading = false
		},
	},
	actions: {
		async loadArticleAction({ commit, dispatch }, payload){
			const { articleId } = payload
			const response: IAxiosResponse<IArticle> & IAxiosErrorResponse = await api({ method: 'get', url: `article/${articleId}` })
			if(response.status >= 400){
				return commit('loadArticleAction_rejected', response)
			}	else {
				return commit('loadArticleAction_fulfilled', response)
			}
	 	},
		async loadAllArticlesAction({ commit, dispatch }, payload){
			const {page, limit} = payload
			const response: IAxiosResponse<IGroupArticle<IArticle>> & IAxiosErrorResponse = await api({ method: 'get', url: `article/global/all?page=${page}&limit=${limit}` })
			if(response.status >= 400){
				return commit('loadAllArticlesAction_rejected', response)
			}	else {
				return commit('loadAllArticlesAction_fulfilled', {
					...response,
					data: {
						tag: 'global',
						articles: response.data
					}
				})  
			}
	 	},
		async loadGroupArticlesAction({ commit, dispatch }, payload){
			const {tag, page, limit} = payload
			const response: IAxiosResponse<IGroupArticle<IArticle>> & IAxiosErrorResponse = await api({ method: 'get', url: `article/global/${tag}?page=${page}&limit=${limit}` })
			if(response.status >= 400){
				return commit('loadGroupArticlesAction_rejected', response)
			}	else {
				return commit('loadGroupArticlesAction_fulfilled', {
					...response,
					data: {
						tag,
						articles: response.data
					}
				})
			}
	 	},
		async removeGroupArticlesAction({ commit, dispatch }, payload){
			const { tag } = payload
			return commit('removeGroupArticlesAction_fulfilled', { tag })
	 	},
		async loadUserArticlesAction({ commit, dispatch }, payload){
			const { username, page, limit } = payload
			const response: IAxiosResponse<IUserArticle<IArticle>> & IAxiosErrorResponse = await api({ method: 'get', url: `article/filter/${username}?page=${page}&limit=${limit}` })
			if(response.status >= 400){
				return commit('loadUserArticlesAction_rejected', response)
			}	else {
				return commit('loadUserArticlesAction_fulfilled', {
					...response,
					data: {
						username,
						articles: response.data
					}
				})
			}
		},
		async loadTagOptionsAction({ commit, dispatch }, payload){
			const response:IAxiosResponse<ITagOption[]> & IAxiosErrorResponse = await api({ method: 'get', url: 'article/options/tag' })
			if(response.status >= 400){
				return commit('loadTagOptionsAction_rejected', response)
			}	else {
				return commit('loadTagOptionsAction_fulfilled', response)
			}
		},
		async createArticleAction({ commit, dispatch }, payload){
			const {username, content, title, tag, navigate, openNotification} = payload
			const callNotification = ({type, message}: ICallNotificationAction ) => {
				openNotification({
					content: message,
					type
				})
			}
			const response: IAxiosResponse<IArticle> & IAxiosErrorResponse = await api({ method: 'post', url: `article/${username}`, data: {tag, title, content} })
			callNotification({
				type: response.status >= 400 ? 'error' : 'success',
				message: response.status >= 400 ? response.data.message : 'Article was created'
			})
			if(response.status >= 400){
				return commit('createArticleAction_rejected', response)
			}	else {
				navigate(`/userinfo/${username}?tab=articles-content`)
				return commit('createArticleAction_fulfilled', response)
			}
		},
		async updateArticleAction({ commit, dispatch }, payload){
			const {articleId, username, content, title, tag, navigate, openNotification} = payload
			const callNotification = ({type, message}: ICallNotificationAction ) => {
				openNotification({
					content: message,
					type
				})
			}
			const response = await api({ method: 'put', url: `article/${articleId}`, data: {tag, title, content} })
			callNotification({
				type: response.status >= 400 ? 'error' : 'success',
				message: response.status >= 400 ? response.data.message : 'Article was updated'
			})
			if(response.status >= 400){
				return commit('updateArticleAction_rejected', response)
			}	else {
				navigate(`/userinfo/${username}?tab=articles-content`)
				return commit('updateArticleAction_fulfilled', response)
			}
		},
		async deleteArticleAction({ commit, dispatch }, payload){
			const {articleId, openNotification, navigate, username} = payload
			const callNotification = ({type, message}: ICallNotificationAction ) => {
				openNotification({
					content: message,
					type
				})
			}
			const response: IAxiosResponse<IArticle> & IAxiosErrorResponse = await api({ method: 'delete', url: `article/${articleId}` })
			const responseUserArticles = await api({ method: 'get', url: `article/filter/${username}?page=1&limit=10` })
			callNotification({
				type: response.status >= 400 ? 'error' : 'success',
				message: response.status >= 400 ? response.data.message : 'Article was deleted'
			})
			if(response.status >= 400){
				return commit('deleteArticleAction_rejected', response)
			}	else {
				navigate(`/userinfo/${username}?tab=articles-content`)
				return commit('updateArticleAction_fulfilled', {
					...responseUserArticles,
					data: {
						username,
						articles: responseUserArticles.data
					}
				})
			}
		},
		async likeArticleAction({ commit, dispatch }, payload){
			const {username, articleId, likes, tag, page, limit} = payload
			const responseUserInfo = await api({ method: 'post', url: `article/like/${articleId}/username/${username}`, data: { likes } })
			const responseGroupArticles = await api({ method: 'get', url: `article/${tag === 'global' ? 'global/all' : `group/${tag}`}?page=${page}&limit=${limit}` })
			if(responseUserInfo.status >= 400){
				return commit('likeArticleAction_rejected', responseUserInfo)
			}	else {
				return commit('likeArticleAction_rejected', {
					...responseGroupArticles,
					user: responseUserInfo.data,
					data: { tag,
						articles: responseGroupArticles.data
					}
				}) 
			}
		}
	},
	getters: { 
		getUserArticles: (state) => {
			return state?.userArticles
		},
		getTags: (state) => {
			return state?.tags
		},
		getGroupArticles: (state) => {
			return state?.groupArticles
		}
	}
}

export default moduleArticle
