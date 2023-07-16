<template>
  <input
    type="search"
    v-model="query"
    @change="search"
    placeholder="نام فیلم،سریال،بازیگر یا کارگردان رو جستجو کنید..."
    class="w-[75%] px-8 py-4 rounded"
  />
  <LoadingSVG v-if="isLoading" />
  <button v-else class="bg-secondary py-2 px-4 text-white rounded w-[50%]">جستجو</button>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import { computed, ref } from 'vue'
import type movieSearchResultItem from '@/interfaces/moviesSearchResultsInterface'
import LoadingSVG from '@/components/icons/LoadingSVG.vue'

const emit = defineEmits(['results', 'startSearch'])
const isLoading: Ref<boolean> = ref(false)

const query: Ref<string> = ref('')
const baseUrl = computed(
  () =>
    `https://api.allorigins.win/raw?url=https://9movie.cfd/wp-json/wp/v2/posts?search=${query.value}&search_columns=post_title&per_page=100&page=1`
)
const items: Ref<Array<movieSearchResultItem>> = ref([])

function search() {
  isLoading.value = true
  fetch(baseUrl.value)
    .then((res) =>
      res.json().then((body) => {
        const d = new DOMParser()

        for (let i = 0; i < body.length; i++) {
          const title: string = body[i].title.rendered
          const link: string = body[i].link
          const thumb: string = d
            .parseFromString(body[i].content.rendered, 'text/html')
            .getElementsByTagName('img')[0].src

          items.value.push({ title, link, thumb })
        }
      })
    )
    .then(() => {
      isLoading.value = false
      emit('results', items.value)
    })
}
</script>

<style scoped>
svg {
  margin: 0 !important;
  padding: 0 !important;
  width: 64px !important;
    height: 64px !important;
}
</style>
