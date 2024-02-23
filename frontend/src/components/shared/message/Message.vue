<script setup lang="ts">
  interface IProps {
		message: string
	}
	const props = defineProps<IProps>();
</script>

<template >
  <span>{{props.message}}</span>
</template>