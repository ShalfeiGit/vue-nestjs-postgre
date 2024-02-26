<script setup lang="ts">
	import { CloseOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons-vue';
  interface DataType {
    key: string;
    title: string;
    content: string[];
    tag: string;
    likes: number;
  }

  interface IProps {
    handleViewArticle(): void,
    handleEditArticle(): void,
    handleRemoveArticle(): void,
    userInfo,
    username,
    row: DataType
  }
  const props = defineProps<IProps>()
</script>

<template>
  <div>
    <a-button class="article-content__manage" type="primary" shape="circle" @click="props.handleViewArticle">
      <template #icon><EyeOutlined /></template>
    </a-button>
    <span v-if="props.userInfo.value?.username === props.username">
      <a-button class="article-content__manage" type="primary" shape="circle" @click="props.handleEditArticle">
        <template #icon><EditOutlined /></template>
      </a-button>
      <a-popconfirm
        title="Вы уверены что хотите удалить статью?"
        @confirm="props.handleRemoveArticle"
        okText="Да"
        cancelText="Нет"
      >
        <a-button class="article-content__manage" type="primary" danger shape="circle">
          <template #icon><CloseOutlined /></template>
        </a-button>
      </a-popconfirm>
    </span>
  </div>
</template>

