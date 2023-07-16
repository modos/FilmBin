<template>
  <div class="bg-primary h-[calc(100dvh)] flex flex-col items-center justify-center gap-3">
    <MoviesSearch v-if="showingPanel === 'search'" @results="showResults" @start-search="isLoading = true"/>
    <MoviesSearchResults
      ref="scrollComponent"
      v-else-if="showingPanel === 'results'"
      :items="searchResults"
      @return="showingPanel = 'search'"
      @select="(v) => itemSelected(v.link, v.selectedItemType.value)"
    />
    <SingleItem
      v-else-if="showingPanel === 'single'"
      :href="href"
      :type="selectedItemType"
      @return="showingPanel = 'search'"
    />
  </div>
</template>

<script setup lang="ts">
import type Ref from 'vue'
import { ref } from 'vue'
import MoviesSearch from '@/components/moviesPanel/MoviesSearch.vue'
import MoviesSearchResults from '@/components/moviesPanel/MoviesSearchResults.vue'
import type movieSearchResultItem from '@/interfaces/moviesSearchResultsInterface'
import SingleItem from '@/components/moviesPanel/SingleItem.vue'
import {computed, onMounted, onUnmounted} from "vue";

const searchResults: Ref<Array<movieSearchResultItem>> = ref([])
const showingPanel: Ref<string> = ref('search')
const selectedItemType: Ref<boolean> = ref('movie')
const href: Ref<string> = ref('')
const cPage: Ref<number> = ref(1)
const scrollComponent = ref(null)
const baseUrl = computed(
    () =>
        `https://api.allorigins.win/raw?url=https://9movie.cfd/wp-json/wp/v2/posts?search=th&search_columns=post_title&per_page=100&page=${cPage}`
)

onMounted(() => {
    window.addEventListener("scroll", handleScroll)
})

onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll)
})

const handleScroll = () => {
    let element = scrollComponent.value
    if (element.getBoundingClientRect().bottom < window.innerHeight) {
        loadMorePosts()
    }
}

function loadMorePosts() {
    cPage.value++;
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

                    searchResults.value.push({ title, link, thumb })
                }
            })
        )
}

function showResults(items: Array<movieSearchResultItem>) {
  searchResults.value = items
  showingPanel.value = 'results'
}

function itemSelected(link: string, type: string) {
  href.value = link
  selectedItemType.value = type
  showingPanel.value = 'single'
}
</script>
