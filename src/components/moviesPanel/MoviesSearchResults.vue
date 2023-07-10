<template>
    <button class="text-white bg-secondary py-2 px-4 rounded" @click="emit('return')">بازگشت</button>
  <ul class="flex gap-3 w-[75%] h-[500px] overflow-y-auto flex-wrap justify-center">
    <li
      @click="select(item.link)"
      v-for="(item, i) in items"
      :key="i"
      class="bg-secondary rounded flex flex-col items-center text-white pb-2 overflow-hidden cursor-pointer basis-1/4 h-[300px]"
    >
      <img :src="item.thumb" alt="" />
      <span class="mr-1">{{ item.title }}</span>
    </li>
  </ul>
</template>

<script setup lang="ts">
import movieSearchResultItem from '@/interfaces/moviesSearchResultsInterface';

defineProps<{
    items: Array<movieSearchResultItem>
}>()

const emit = defineEmits(['return', 'select'])

function select(link: string) {
    emit('select', link);
}
</script>

<style scoped></style>
