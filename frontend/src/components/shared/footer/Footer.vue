<template >
	<div className="footer">
		<div className="footer__wrapper">
			<a-typography-text className="footer__text">Copyright &copy;{{year}} Designed by Valentin Zadorozhniy{{' '}}</a-typography-text>
			<a href="https://t.me/Shalfei"><a-message :style="{ color: '#ffffff' }"/></a>	
	  </div>
	</div>
</template>

<script >
	import { Typography } from 'ant-design-vue';
	import Icon, { SendOutlined } from '@ant-design/icons-vue';
	import moment from 'moment'
  export default {
		components: {
      ATypography: Typography,
      AIcon: Icon,
			AMessage: SendOutlined
    },
		computed: {
			year(){
				return moment().year()
			},
		}
  }
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
		}
		&__text{
			color: $white-color;
		}
		&__icon{
			color: $white-color;
		}
	}
</style>