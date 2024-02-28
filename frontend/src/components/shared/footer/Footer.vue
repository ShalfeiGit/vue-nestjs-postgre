<template >
		<div v-if="isShowFooter">
			<div className="footer">
			<div className="footer__wrapper">
				<a-typography-text className="footer__text">Copyright &copy;{{year}} Designed by Valentin Zadorozhniy{{' '}}</a-typography-text>
				<a href="https://t.me/Shalfei"><a-logo class="footer__icon"></a-logo></a>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" >
	import moment from 'moment'
	import ALogo from '@app/shared/footer/svg/telegramm.svg';
	import { computed } from 'vue';
import { useRoute } from 'vue-router';
	const router = useRoute();
	const isShowFooter = computed<boolean>(() => router.path === '/')
	const year = computed(() => moment().year())
</script>

<style lang="scss">
	@import '@app/App.scss';

	.footer{
		margin-top: 40px;
		background-color: $blue-color;
		width: 100%;
		height: 70px;
		display: flex;
		justify-content: center;
		align-content: center;
		&__wrapper{
			align-self: center;
			display: flex;
		}
		&__text{
			color: $white-color;
		}
		&__icon{
			margin-left: 5px;
			height: 19px;
			width: 15px;
		}
		&__text{
			font-size: 14px;
			display: flex;
			justify-content: center;
			padding-top: 2px;
		}
	}
</style>