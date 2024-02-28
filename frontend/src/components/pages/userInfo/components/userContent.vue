<script setup lang="ts" >
	import { computed, reactive, UnwrapRef, onMounted, toRaw, watch } from 'vue';
	import { useRoute, useRouter } from 'vue-router'
	import { useStore } from 'vuex'
	import { Form, UploadFile } from 'ant-design-vue';
	import { PlusOutlined as AppPlusOutlined } from '@ant-design/icons-vue';
	
	import { INotificationAction, IUserInfo } from '@app/store/modules/userInfo'
	import { IOtherAuthorInfo } from '@app/store/modules/otherAuthorInfo';

	interface FormState {
		username: string;
		email: string;
		bio: string;
		age: number;
		gender: string;
	}

	interface IProps{
		openNotification: INotificationAction['openNotification'];
		key: string;
	}

	const labelCol = {
		xs: { span: 24 },
		sm: { span: 4 }
	}
	const wrapperCol = {
		xs: { span: 24 },
		sm: { span: 16 }
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
	const props = defineProps<IProps>()
	const store = useStore()
	const route = useRoute()
	const router = useRouter()
	const useForm = Form.useForm;
	const modelRef: UnwrapRef<FormState> = reactive({
		username: route.params.username.toString(),
		email: '',
		bio: '',
		age: null,
		gender: '',
	});
	const uploadOptions = reactive({
		title: '',
		image: '',
		open: false,
		showPreview: true,
		fileInfo: null,
		fileList: []
	});
	const handleEmailValidator = (rule: { required: boolean }, value: string, cb) => {
		if(rule?.required && (!value || !value.trim())){
			return Promise.reject('Field must not be empty')
		}
		if(value.length < 6){
			return Promise.reject('Email length must be longer than 6 characters')
		}
		if(value.search(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g)){
			return Promise.reject('Incorrect email. Example correct email: test@gmail.com')
		}
		return Promise.resolve()
	}
	const handleAgeValidator = (rule: { required: boolean }, value: number, cb) => {
		if(value <= 0){
			return Promise.reject('Age must be more 0')
		}
		return Promise.resolve()
	}
	const rulesRef = reactive({	email: [{ required: true, validator: handleEmailValidator	}],	age:[{ validator: handleAgeValidator }]});
	const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);
	const userInfo = computed<IUserInfo>(() => store.getters["userInfo/getUserInfo"])		
	const otherAuthorInfo = computed<IOtherAuthorInfo>(() => store.getters["otherAuthorInfo/getOtherAuthorInfo"])
	const isDisabledInput = computed<boolean>(() => route.params.username && userInfo.value?.username !== route.params.username)
	const emailError = computed(() => {
		return validateInfos['email'];
	});

	const genderOptions =[
		{label: 'male', value: 'male'},
		{label: 'female', value: 'female'},
		{label: 'others', value: 'others'}
	]

	const handleUploadAvatarEvent = async options => {
		const { onSuccess, onError, file } = options
		if(/(jpg|jpeg|png)$/.test(file.name)){
			onSuccess('Ok')
		}else{
			onError({ err: `Unsupported file type ${file.type}` })
		}
	}
	const handleLoadAvatar = async ({ file, fileList, event }) => {
		if(file.status === 'removed') return 
		if(file.status === 'error') return
		const fileMatch = file.name.match(/(jpg|jpeg|png)$/) 
		if(fileMatch){
			const getBase64 = (file): Promise<string> =>
				new Promise((resolve, reject) => {
					const reader = new FileReader()
					reader.readAsDataURL(file)
					reader.onload = () => resolve(reader.result as string)
					reader.onerror = (error) => reject(error)
				})
			const formData = new FormData()
			const avatarDate = Date.now().toString()
			const fileInfo = {
				preview: await getBase64(file.originFileObj),
				ext: fileMatch[0],
				avatarDate 
			}
			formData.append('avatar', fileInfo.preview)
			formData.append('ext', fileInfo.ext)
			formData.append('avatarDate', avatarDate)
			const cb = () => {
				uploadOptions.fileInfo = fileInfo
				uploadOptions.image = `http://localhost:3000/avatars/${route.params.username}-${avatarDate}.${fileInfo.ext}`
				uploadOptions.showPreview = true
				uploadOptions.fileList = [	{
						uid: `${route.params.username}`,
						name: `${route.params.username}.${fileInfo.ext}`,
						status: 'done',
						url: `http://localhost:3000/avatars/${route.params.username}-${avatarDate}.${fileInfo.ext}`,
					}]
			}
			store.dispatch('userInfo/savePreviewUserAvatarAction', {username: route.params.username, formData, cb})
		}
	}
	const handleCancelAvatar = () => {
		uploadOptions.fileInfo = null,
		uploadOptions.fileList = [],
		uploadOptions.showPreview = false
		return 
	}
	const handleShowPreviewAvatar = async (file: UploadFile) => {
		uploadOptions.open = true
		uploadOptions.title = userInfo.value?.username === route.params.username ? userInfo.value?.username : otherAuthorInfo.value.username
	}
	const handleClosePreviewAvatar = () => {
		uploadOptions.open = false
	} 
	const handleLogOutUser = () => {
		store.dispatch('userInfo/resetUserInfoAction', {navigate: router.push })
	}
	const handleDeleteUser = () => {
		store.dispatch('userInfo/deleteUserInfoAction', {navigate: router.push, username: userInfo.value?.username })
	}
	
	const handleSubmitForm = (e) => {
		const formData = new FormData()
		validate().then(() => {
			const values = toRaw(modelRef);
			if(uploadOptions.fileInfo){
				formData.append('avatar', uploadOptions.fileInfo?.preview)
				formData.append('ext', uploadOptions.fileInfo?.ext)
				formData.append('avatarDate', uploadOptions.fileInfo?.avatarDate)
				Object.keys(values).map(key => formData.append(key, values[key]))
				store.dispatch('userInfo/updateUserInfoAction', {...values, formData, openNotification: props.openNotification, navigate: router.push })
			}else{
				formData.append('avatarDate', uploadOptions.fileInfo?.avatarDate 
					? uploadOptions.fileInfo.avatarDate 
					: `${userInfo.value?.avatarUrl}`.replace(`/avatars/${userInfo.value?.username}-`, '').replace(/\.\w+$/g, ''))
				if(uploadOptions.fileList.length < 1){
					store.dispatch('userInfo/deletePreviewUserAvatarAction', {username: userInfo.value?.username, formData })
				} else {
					formData.append('avatarUrl', userInfo.value?.avatarUrl)
				}
				Object.keys(values).map(key => formData.append(key, values[key]))
				store.dispatch('userInfo/updateUserInfoAction', {...values, formData, openNotification: props.openNotification, navigate: router.push })
			}
		})
		.catch(err => {
			console.log('error', err);
		});
	}
	watch(() => route.params.username,
    async () => {
			resetFields()
			if(userInfo.value?.username !== route.params.username){
				await store.dispatch('otherAuthorInfo/getOtherAuthorInfoAction', {username: route.params.username})
			} 
			const matchUser = userInfo.value?.username === route.params.username
			if(userInfo.value?.avatarUrl){
				uploadOptions.image = `http://localhost:3000${matchUser ? userInfo.value?.avatarUrl : otherAuthorInfo.value?.avatarUrl}`,
				uploadOptions.showPreview = true,
				uploadOptions.fileList = [{
						uid: `${route.params.username}`,
						name: `${matchUser ? userInfo.value?.avatarUrl : otherAuthorInfo.value?.avatarUrl}`.replace('/avatars/', ''),
						status: 'done',
						url: `http://localhost:3000${matchUser ? userInfo.value?.avatarUrl : otherAuthorInfo.value?.avatarUrl}`,
					}]
			}else {
				uploadOptions.fileInfo = null,
				uploadOptions.fileList = [],
				uploadOptions.showPreview = false
			}
			modelRef.username = matchUser ? userInfo.value?.username : otherAuthorInfo.value?.username
			modelRef.email = matchUser ? userInfo.value?.email : otherAuthorInfo.value?.email
			modelRef.bio = matchUser ? userInfo.value?.bio : otherAuthorInfo.value?.bio
			modelRef.age = matchUser ? userInfo.value?.age : otherAuthorInfo.value?.age
			modelRef.gender = matchUser ? userInfo.value?.gender : otherAuthorInfo.value?.gender
    },
    {deep: true, immediate: true})
</script>

<template >
  <div class="user-content">
		<a-typography-text class="user-content__text">User Info</a-typography-text>
			<div class="user-content__avatar">
				<a-upload
					accept="image/*"
					list-type="picture-card"
					:multiple="false"
					v-model:file-list="uploadOptions.fileList"
					:customRequest="handleUploadAvatarEvent"
					@change="handleLoadAvatar"
					@remove="handleCancelAvatar"
					@preview="handleShowPreviewAvatar"
					:showUploadList="uploadOptions.showPreview"
					:defaultFileList="uploadOptions.fileList"
					:disabled="userInfo?.username !== route.params.username"
					class="image-upload-grid"
				>
					<div v-if="uploadOptions.fileList.length < 1">
						<app-plus-outlined />
						<div class="ant-upload-text">Upload</div>
					</div>
				</a-upload>
				<a-modal :open="uploadOptions.open" :title="uploadOptions.title" :footer="null" @cancel="handleClosePreviewAvatar">
					<img class="user-content__modal" :src="uploadOptions.image" />
				</a-modal>
			</div>
			<a-form
				:labelCol="labelCol"
				:wrapperCol="wrapperCol"
			>
				<a-form-item 
					label="Username" 
					name="username" 
				>
					<a-input disabled v-model:value="modelRef.username" ></a-input>
				</a-form-item>

				<a-form-item 
					label="Email" 
					name="email"
					:validate-status="emailError.validateStatus" 
					:help="emailError.help"
				>
					<a-input :disabled="isDisabledInput" placeholder="Input email" v-model:value="modelRef.email" ></a-input>
				</a-form-item>

				<a-form-item
					label="Bio" 
					name="bio"
				>
					<a-textarea :disabled="isDisabledInput" placeholder="Input bio" v-model:value="modelRef.bio"></a-textarea>
				</a-form-item>

				<a-form-item 
					label="Age" 
					name="age"
				>
					<a-input type="number" :disabled="isDisabledInput" placeholder="Input age" v-model:value="modelRef.age"></a-input>
				</a-form-item>

				<a-form-item 
					label="Gender" 
					name="gender"
				>
					<a-select :disabled="isDisabledInput" :options="genderOptions"  v-model:value="modelRef.gender" ></a-select>
				</a-form-item>
				<a-form-item :wrapperCol="tailWrapperCol" >
					<div v-if="!isDisabledInput">
						<a-button class="user-content__button" type="primary" @click.prevent="handleSubmitForm">
							Submit
						</a-button>
						<a-button class="user-content__button" type="primary" ghost @click="handleLogOutUser">
							Log Out
						</a-button>

						<a-popconfirm
							title="Вы уверены что хотите удалить пользователя и все его статьи?"
							@confirm="handleDeleteUser"
							okText="Да"
							cancelText="Нет"
						>
							<a-button type="primary" danger >
								Delete
							</a-button>
						</a-popconfirm>
					</div>
				</a-form-item>
			</a-form>
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
		&__modal{
			width: 100%
		}
		&__button {
			margin-right: 8px;
		}
	}
	.error-infos :deep(.ant-form-explain) {
		white-space: pre-line;
	}
</style>
