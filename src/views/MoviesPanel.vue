<template>
  <div class="bg-primary h-[calc(100dvh)] flex flex-col items-center justify-center gap-3">
    <img
      v-if="showingPanel === 'search'"
      src="../assets/logo.png"
      width="300"
      height="300"
      alt=""
    />
    <MoviesSearch v-if="showingPanel === 'search'" @results="showResults" />
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
import { ref } from 'vue';
import MoviesSearch from '@/components/moviesPanel/MoviesSearch.vue';
import MoviesSearchResults from '@/components/moviesPanel/MoviesSearchResults.vue';
import type movieSearchResultItem from '@/interfaces/moviesSearchResultsInterface';
import SingleItem from '@/components/moviesPanel/SingleItem.vue';
const searchResults = ref<Array<movieSearchResultItem>>([]);
const showingPanel = ref<string>('search');
const selectedItemType = ref<string>('movie');
const href = ref<string>('');
const scrollComponent = ref(null);

function showResults(items: Array<movieSearchResultItem>) {
  searchResults.value = items;
  showingPanel.value = 'results';
}

function itemSelected(link: string, type: string) {
  href.value = link;
  selectedItemType.value = type;
  showingPanel.value = 'single';
}
</script>
