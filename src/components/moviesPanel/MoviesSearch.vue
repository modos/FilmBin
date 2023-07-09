<template>
  <input
    v-model="query"
    @change="search"
    placeholder="نام فیلم رو جستجو کنید..."
    class="w-[50%] px-8 py-4 rounded"
  />
  <button class="bg-secondary py-2 px-4 text-white rounded">جستجو</button>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import { computed, ref } from 'vue'
import movieSearchResultItem from '@/interfaces/moviesSearchResultsInterface'

const emit = defineEmits(['results'])

const query: Ref<string> = ref('')
const baseUrl = computed(
  () =>
    `https://api.allorigins.win/raw?url=https://9movie.cfd/wp-json/wp/v2/posts?search=${query.value}&search_columns=post_title`
)
const items: Ref<Array<movieSearchResultItem>> = ref([])

function search() {
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
      emit('results', items.value)
    })
}
</script>

<style scoped></style>
