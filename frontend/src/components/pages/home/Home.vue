<template >
	<div class="home">
		<div class="home__explanation">
			<div class="home__title">
				<a-typography-text>Vue-Nestjs-PostgreSQL Startup</a-typography-text>
			</div>
			<div class="home__content">
				<a-typography-text>A place to share your knowledge.</a-typography-text>
			</div>
		</div>
		<a-row>
			<a-col :span="1"></a-col>
			<a-col :span="16">Feeds</a-col>
			<a-col :span="1"></a-col>
			<a-col :span="6"><app-popular-tags :page="1" :limit="10"></app-popular-tags></a-col>
		</a-row>
	</div>
</template>

<script setup lang="ts">
import AppPopularTags from "@app/pages/home/components/PopularTags.vue";	
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
