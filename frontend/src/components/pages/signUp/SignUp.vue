<script setup lang="ts">
import { INotificationAction } from '@app/store/modules/userInfo';
import { Form } from 'ant-design-vue';
import { computed, reactive, UnwrapRef } from 'vue';
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

interface FormState {
	username: string,
	email: string,
	pass: string,
	repeatPass: string,
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
	const modelRef: UnwrapRef<FormState> = reactive({
		username: '',
		email: '',
		pass: '',
		repeatPass: '',
	});

	const props = defineProps<IProps>()
	const store = useStore()
	const router = useRouter()

	const handleUsernameValidator = (rule: { required: boolean }, value: string) => {
		if(rule?.required && (!value || !value.trim())){
			return Promise.reject(new Error('Field must not be empty'))
		}
		if(value.length < 6){
			return Promise.reject(new Error('Username length must be longer than 6 characters'))
		}
		if(value.search(/^[a-zA-Z0-9]+$/)){
			return Promise.reject(new Error('Incorrect login. Use characters a-z, A-Z, 0-9'))
		}
		return Promise.resolve()
	}

	const handleEmailValidator = (rule: { required: boolean }, value: string) => {
		if(rule?.required && (!value || !value.trim())){
			return Promise.reject(new Error('Field must not be empty'))
		}
		if(value.length < 6){
			return Promise.reject(new Error('Email length must be longer than 6 characters'))
		}
		if(value.search(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g)){
			return Promise.reject(new Error('Incorrect email. Example correct email: test@gmail.com'))
		}
		return Promise.resolve()
	}

	const handlePasswordValidator = (rule: { required: boolean }, value: string) => {
		if(rule?.required && (!value || !value.trim())){
			return Promise.reject(new Error('Field must not be empty'))
		}
		if(value.length < 6){
			return Promise.reject(new Error('Password length must be longer than 6 characters'))
		}
		if(value.search(/^[a-zA-Z0-9]+$/)){
			return Promise.reject(new Error('Incorrect password. Use characters a-z, A-Z, 0-9'))
		}
		return Promise.resolve()
	}

	const handleRepeatPasswordValidator = (rule: { required: boolean }, value: string) => {
		if(rule?.required && (!value || !value.trim())){
			return Promise.reject(new Error('Field must not be empty'))
		}
		if(modelRef.pass !== value){
			return Promise.reject(new Error('Password fields must be the same'))
		}
		return Promise.resolve()
	}

	const rulesRef = reactive({	
		username: [{ validator: handleUsernameValidator }],	
		email:[{ validator: handleEmailValidator }], 
		pass:[{ validator: handlePasswordValidator }], 
		repeatPass:[{ validator: handleRepeatPasswordValidator }], 
	});

	const useForm = Form.useForm;
	const { validate, validateInfos } = useForm(modelRef, rulesRef);

	const usernameError = computed(() => {
		return validateInfos['username'];
	});
	const emailError = computed(() => {
		return validateInfos['email'];
	});
	const passError = computed(() => {
		return validateInfos['pass'];
	});
	const repeatPassError = computed(() => {
		return validateInfos['repeatPass'];
	});
	const handleSubmitForm = () => {
		validate().then((values) => {
			store.dispatch('userInfo/signUpAction', {
				username: modelRef?.username,
				email: modelRef?.pass,
				pass: modelRef?.pass,
				navigate: router.push,
				openNotification: props.openNotification
			})
		})
		.catch(err => {
			console.log('error', err);
			console.log(validateInfos)
		});
	}
</script>

<template >
  <div class="signup">
		<a-typography-title class='signup__text'>Sign In</a-typography-title>
		<router-link class="signup__link-title" :to="{ name: 'signIn' }">
			Have an account?
		</router-link>
		<a-form 
				:labelCol="labelCol"
				:wrapperCol="wrapperCol"
			>
			<a-form-item 
					label="Username" 
					name="username"
					:validate-status="usernameError.validateStatus" 
					:help="usernameError.help"
				>
					<a-input 
						placeholder="Input username"
						v-model:value="modelRef.username"  
					>
					</a-input>
				</a-form-item>
				<a-form-item 
					label="Email" 
					name="email"
					:validate-status="emailError.validateStatus" 
					:help="emailError.help"
				>
					<a-input 
						placeholder="Input email"
						v-model:value="modelRef.email"  
					>
					</a-input>
				</a-form-item>
				<a-form-item 
					label="Password" 
					name="pass"
					:validate-status="passError.validateStatus" 
					:help="passError.help"
				>
					<a-input-password 
						placeholder="Input password"
						v-model:value="modelRef.pass"  
					>
					</a-input-password>
				</a-form-item>
				<a-form-item 
					label="Repeat password" 
					name="repeatPass"
					:validate-status="repeatPassError.validateStatus" 
					:help="repeatPassError.help"
				>
					<a-input-password
						placeholder="Input password"
						v-model:value="modelRef.repeatPass"  
					>
					</a-input-password>
				</a-form-item>
				<a-form-item :wrapperCol="tailWrapperCol" >
					<a-button type="primary"  @click="handleSubmitForm" >
						Сохранить
					</a-button>
				</a-form-item>
		</a-form>
	</div>
</template>

<style lang="scss">
	@import '@app/app.scss';

	.signup{
		display: flex;
		flex-direction: column;
		align-items: center;
		& form {
			width: 100%;
			max-width: 800px;
		}
		&__link-title{
			color: $blue-color;
			text-decoration: none;
			font-size: 16px;
		}
	}
</style>