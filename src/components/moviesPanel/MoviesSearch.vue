<template>
  <input
    type="search"
    v-model="query"
    @change="doSearch"
    placeholder="نام فیلم،سریال،بازیگر یا کارگردان رو جستجو کنید..."
    class="w-[75%] px-8 py-4 rounded"
  />
  <div class="w-[25%] flex justify-center h-[5%]">
    <LoadingSVG v-if="isLoading" />
    <span class="text-white text-sm" v-else-if="isError"
      >مشکلی پیش اومده! لطفا دوباره تلاش کنید</span
    >
    <button v-else class="bg-secondary text-white rounded w-full">جستجو</button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type movieSearchResultItem from '@/interfaces/moviesSearchResultsInterface';
import LoadingSVG from '@/components/icons/LoadingSVG.vue';
import { search } from '@/utils/search';

const emit = defineEmits(['results']);
const isLoading = ref<boolean>(false);
const isError = ref<boolean>(false);

const query = ref<string>('');
const baseUrl = computed(
  () =>
    `https://api.allorigins.win/raw?url=https://9movie.cfd/wp-json/wp/v2/posts?search=${query.value}&search_columns=post_title&per_page=100`
);
const items = ref<Array<movieSearchResultItem>>([]);

async function doSearch() {
  isLoading.value = true;
  const { data, error } =  await search(baseUrl.value);

  if (error) {
    isLoading.value = false;
    isError.value = true;
  } else {
    isLoading.value = false;
    items.value = data;
    emit('results', items.value);
  }
}
</script>
