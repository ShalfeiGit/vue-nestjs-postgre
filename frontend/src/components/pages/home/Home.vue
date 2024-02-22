<template >
	<div className="home">
		<div className="home__explanation">
			<div className="home__title">
				<a-typography-text>Vue-Nestjs-PostgreSQL Startup</a-typography-text>
			</div>
			<div className="home__content">
				<a-typography-text>A place to share your knowledge.</a-typography-text>
			</div>
		</div>
		<a-row :justify="end">
			<a-col :span="1"></a-col>
			<a-col :span="16">Feeds</a-col>
			<a-col :span="1"></a-col>
			<a-col :span="6">PopularTags</a-col>
		</a-row>
		<a-row :justify="end" class="home__footer">
			<a-col :span="24"><app-footer></app-footer></a-col>
		</a-row>
	</div>
</template>

<script setup >
	import AppFooter from '@app/shared/footer/Footer.vue';
</script>

<style lang="scss">
	@import '@app/App.scss';

	.home {
		&__explanation{
			background-color: $blue-color;
			padding-top: 40px;
			padding-bottom: 40px;
		}
		&__title .ant-typography{
			display: flex;
			justify-content: center;
			font-size: 48px;
			font-weight: bold;
			color: $white-color;
		}
		&__content, &__content .ant-typography{
			display: flex;
			justify-content: center;
			font-size: 28px;
			color: $white-color;
		}
	}
</style>
