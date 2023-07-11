<template>
  <div class="bg-primary h-[calc(100dvh)] flex flex-col items-center justify-center gap-3">
    <MoviesSearch v-if="showingPanel === 'search'" @results="showResults" />
    <MoviesSearchResults
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

const searchResults: Ref<Array<movieSearchResultItem>> = ref([])
const showingPanel: Ref<string> = ref('search')
const selectedItemType: Ref<boolean> = ref('movie')
const href: Ref<string> = ref('')

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

<style scoped></style>
