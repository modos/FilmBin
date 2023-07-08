<template>
    <div class="bg-primary h-[calc(100dvh)] flex flex-col items-center justify-center gap-3">
        <input v-model="query" @change="search" placeholder="نام فیلم رو جستجو کنید..." class="w-[50%] px-8 py-4 rounded">
        <button class="bg-secondary py-2 px-4 text-white rounded">جستجو</button>
        <ul class="flex gap-3 w-[50%] h-[500px] overflow-y-auto flex-wrap justify-center">
            <li v-for="(item, i) in items" :key="i" class="bg-secondary rounded flex flex-col items-center text-white pb-2 overflow-hidden cursor-pointer basis-1/5 h-[300px]">
                <img :src="item.thumb"/>
                <span class="mr-1">{{item.title}}</span>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import type {Ref} from "vue";
import {computed, ref} from "vue";


interface item {
    title: string,
    thumb: string,
    link: string
}

const query: Ref<string> = ref("");
const baseUrl = computed(() => `https://api.allorigins.win/raw?url=https://9movie.cfd/wp-json/wp/v2/posts?search=${query.value}&search_columns=post_title`);
const items: Ref<Array<item>> = ref([]);

function search() {
    fetch(baseUrl.value).then(res => res.json().then(body => {
        const d = new DOMParser();

        for (let i = 0; i < body.length; i++) {
            const title: string = body[i].title.rendered;
            const link: string = body[i].link;
            const thumb: string = d.parseFromString(body[i].content.rendered, "text/html").getElementsByTagName('img')[0].src;

            items.value.push({title, link, thumb});
        }
    }));
}
</script>

<style scoped>

</style>