<script setup lang="ts" >
	import { computed, onMounted, reactive, UnwrapRef, watch } from 'vue';
	import { useRoute, useRouter } from 'vue-router'
	import { useStore } from 'vuex'
	import { Form } from 'ant-design-vue';
	
	import { INotificationAction, IUserInfo } from '@app/store/modules/userInfo'
	import { IArticle, ITagOption } from '@app/store/modules/article';

	interface FormState {
		title: string;
		tag: string;
		content: string;
	}

	interface IProps{
		openNotification: INotificationAction['openNotification'];
	}

	const tailWrapperCol = {
		xs: {
			span: 24,
			offset: 0
		},
		sm: {
			span: 16,
			offset: 4
		}
	}

	const labelCol = {
		xs: { span: 24 },
		sm: { span: 4 }
	}
	const wrapperCol = {
		xs: { span: 24 },
		sm: { span: 16 }
	}

	const handleTitleValidator = (rule: { required: boolean }, value: string) => {
		if (!value || !value.trim()) {
			return Promise.reject(new Error('Field must not be empty'))
		}
		if (value.length < 6) {
			return Promise.reject(new Error('Title length must be longer than 6 characters'))
		}
		return Promise.resolve()
	}

	const handleTagValidator = (rule: { required: boolean }, value: string) => {
		if (!value || !value.trim()) {
			return Promise.reject(new Error('Field must not be empty'))
		}
		return Promise.resolve()
	}

	const handleContentValidator = (rule: { required: boolean }, value: string) => {
		if (!value || Array.isArray(value) && value.length === 0 || typeof value === 'string'  && !value.trim()) {
			return Promise.reject(new Error('Field must not be empty'))
		}
		return Promise.resolve()
	}
	const modelRef: UnwrapRef<FormState> = reactive({
		title: '',
		tag: '',
		content: '',
	});
	const rulesRef = reactive({	title: [{ validator: handleTitleValidator }],	tag:[{ validator: handleTagValidator }], content: [{ validator: handleContentValidator }]});
	const useForm = Form.useForm;
	const { validate, validateInfos } = useForm(modelRef, rulesRef);

	const titleError = computed(() => {
		return validateInfos['title'];
	});
	const tagError = computed(() => {
		return validateInfos['tag'];
	});
	const contentError = computed(() => {
		return validateInfos['content'];
	});

	const props = defineProps<IProps>()
	const store = useStore()
	const route = useRoute()
	const router = useRouter()
	const tagOptions = computed<ITagOption[]>(() => store.getters["article/getTags"])
	const userInfo = computed<IUserInfo>(() => store.getters["userInfo/getUserInfo"])
	const articleInfo = computed<IArticle>(() => store.getters["article/getArticleInfo"])			

	const handleSaveArticle = () => {
		validate().then((values) => {
			if(route.params.slug){
				store.dispatch('article/updateArticleAction', {
					articleId: route.params.slug,
					title: modelRef?.title,
					content: Array.isArray(modelRef?.content) ? modelRef?.content.join('\n').trim() : (modelRef?.content ?? ''),
					tag: modelRef?.tag,
					username: userInfo.value?.username,
					navigate: router.push,
					openNotification: props.openNotification
				})
			} else{
				store.dispatch('article/createArticleAction', {
					title: modelRef?.title,
					content: (modelRef?.content ?? ''),
					tag: modelRef?.tag,
					username: userInfo.value?.username,
					navigate: router.push,
					openNotification: props.openNotification,
				})
			}
		})
		.catch(err => {
			console.log('error', err);
			console.log(validateInfos)
		});
	}

	const handleRedirectToListArticle = () => {
		router.push({
      name: "userInfo",
			params: {
        username: route.params.username
      },
			query: {
				tab: 'articles-content'
			}
    })
	}

	onMounted(() => {
		if(route.params.slug) {
			store.dispatch('article/loadArticleAction', { articleId: route.params.slug })
		}
	})
	watch(() => articleInfo.value, () => {
		if(articleInfo.value && route.params.slug) {
			modelRef.title = articleInfo.value?.title
			modelRef.tag =  articleInfo.value?.tag
			modelRef.content = (articleInfo.value?.content ?? []).join('\n')
		}
	},
  {deep: true, immediate: true})
</script>

<template >
	<div class="article">
			<a-form 
				:labelCol="labelCol"
				:wrapperCol="wrapperCol"
			>
				<a-form-item 
					label="Title" 
					name="title"
					:validate-status="titleError.validateStatus" 
					:help="titleError.help"
				>
					<a-input 
						v-model:value="modelRef.title"  
					>
					</a-input>
				</a-form-item>

				<a-form-item 
					label="Tag" 
					name="tag"
					:validate-status="tagError.validateStatus" 
					:help="tagError.help"
				>
					<a-select 
						v-model:value="modelRef.tag"
						:options="tagOptions"
					></a-select>
				</a-form-item>

				<a-form-item 
					label="Content" 
					name="content"
					:validate-status="contentError.validateStatus" 
					:help="contentError.help"
				>
					<a-textarea 
						v-model:value="modelRef.content"
						:autoSize="{ minRows: 20}"
					></a-textarea>
				</a-form-item>

				<a-form-item :wrapperCol="tailWrapperCol" >
					<a-popconfirm
						title="Вы уверены что хотите сохранить статью?"
						@confirm="handleSaveArticle"
						@cancel="handleRedirectToListArticle"
						okText="Да"
						cancelText="Нет"
					>
						<a-button type="primary" >
							Сохранить
						</a-button>
					</a-popconfirm>
				</a-form-item>
			</a-form>
		</div>
</template>