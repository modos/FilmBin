<template>
  <input
    type="search"
    v-model="query"
    @change="search"
    placeholder="نام فیلم،سریال،بازیگر یا کارگردان رو جستجو کنید..."
    class="w-[75%] px-8 py-4 rounded"
  />
  <div class="w-[25%] flex justify-center h-[5%]">
      <LoadingSVG v-if="isLoading" />
      <span class="text-white text-sm" v-else-if="isError">مشکلی پیش اومده! لطفا دوباره تلاش کنید</span>
      <button v-else class="bg-secondary text-white rounded w-full">جستجو</button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type movieSearchResultItem from '@/interfaces/moviesSearchResultsInterface';
import LoadingSVG from '@/components/icons/LoadingSVG.vue';

const emit = defineEmits(['results']);
const isLoading = ref<boolean>(false);
const isError = ref<boolean>(false);

const query= ref<string>('');
const baseUrl = computed(
  () =>
    `https://api.allorigins.win/raw?url=https://9movie.cfd/wp-json/wp/v2/posts?search=${query.value}&search_columns=post_title&per_page=100`
);
const items = ref<Array<movieSearchResultItem>>([]);

function search() {
  isLoading.value = true;
  fetch(baseUrl.value)
    .then((res) =>
      res.json().then((body) => {
        const d = new DOMParser();

        for (let i = 0; i < body.length; i++) {
          const title: string = body[i].title.rendered;
          const link: string = body[i].link;
          const thumb: string = d
            .parseFromString(body[i].content.rendered, 'text/html')
            .getElementsByTagName('img')[0].src;

          items.value.push({ title, link, thumb });
        }
      })
    )
    .then(() => {
      isLoading.value = false;
      emit('results', items.value);
    }).catch(() => {
      isLoading.value = false;
        isError.value = true;
  });
}
</script>