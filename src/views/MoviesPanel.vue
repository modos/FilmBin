<template>
    <div class="bg-primary h-[calc(100dvh)] flex flex-col items-center justify-center gap-3">
    <MoviesSearch v-if="isSearching" @results="showResults"/>
    <MoviesSearchResults v-else :items="searchResults" @return="isSearching = true"/>
    </div>
</template>

<script setup lang="ts">
import type Ref from 'vue';
import {ref} from 'vue';
import MoviesSearch from "@/components/moviesPanel/MoviesSearch.vue";
import MoviesSearchResults from "@/components/moviesPanel/MoviesSearchResults.vue";
import type movieSearchResultItem from "@/interfaces/moviesSearchResultsInterface";

const searchResults: Ref<Array<movieSearchResultItem>> = ref([]);
const isSearching: Ref<boolean> = ref(true);
function showResults(items: Array<movieSearchResultItem>) {
    searchResults.value = items;
    isSearching.value = false;

}

</script>

<style scoped>
</style>