<script setup lang="ts">
import { INotificationAction } from '@app/store/modules/userInfo';
import { Form } from 'ant-design-vue';
import { computed, reactive, UnwrapRef } from 'vue';
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

interface FormState {
	username: string;
	pass: string;
	remember: boolean;
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
		pass: '',
		remember: true,
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

	const rulesRef = reactive({	
		username: [{ required: true, validator: handleUsernameValidator }],	
		pass:[{ required: true, validator: handlePasswordValidator }], 
	});

	const useForm = Form.useForm;
	const { validate, validateInfos } = useForm(modelRef, rulesRef);

	const usernameError = computed(() => {
		return validateInfos['username'];
	});
	const passError = computed(() => {
		return validateInfos['pass'];
	});
	const handleSubmitForm = () => {
		validate().then((values) => {
			store.dispatch('userInfo/signInAction', {
				username: modelRef?.username,
				pass: modelRef?.pass,
				remember: modelRef?.remember,
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
  <div class="signin">
		<a-typography-title class='signin__text'>Sign In</a-typography-title>
		<router-link class="signin__link-title" :to="{ name: 'signUp' }">
			Need an account?
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
					label="Remember me" 
					name="remember"
				>
					<a-checkbox v-model:checked="modelRef.remember"></a-checkbox>
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

	.signin{
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