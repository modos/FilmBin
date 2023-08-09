<template>
    <Transition name="show">
        <div v-if="linkCopied" class="absolute top-0 text-[12px] bg-green-500 py-1 w-[50%] text-center rounded-b">
            لینک پوشه دانلود کپی شد
        </div>
    </Transition>
  <button class="text-white bg-secondary py-2 px-4 rounded" @click="emit('return')">بازگشت</button>
    <LoadingSVG v-if="isLoading"/>
    <div v-else>
        <ul v-if="props.type === 'series'" class="h-[300px] overflow-y-auto w-full pl-2">
            <li class="w-[400px]" v-for="(item, i) in links" :key="i">
                <span class="text-white">{{ item.title }}</span>
                <span v-html="item.details" class="flex gap-3 text-green-400"></span>
                <ul class="mt-2">
                    <li class="bg-yellow-400 py-2 px-8 rounded mb-4 flex justify-between items-center" v-for="(link, j) in item.links" :key="j">
                        <span>{{ link.spans }}</span>
                        <button ref="copyButton" @click="copy(link.link)" class="bg-blue-500 text-white py-1 px-4 rounded">کپی</button>
                    </li>
                </ul>
            </li>
        </ul>
        <ul v-else class="h-[300px] overflow-y-auto w-full">
            <li class="w-[400px]" v-for="(item, i) in links" :key="i">
                <span class="text-white">{{ item.title }}</span>
                <ul class="mt-2">
                    <li class="bg-yellow-400 py-2 px-8 rounded mb-4 flex justify-between items-center" v-for="(link, j) in item.links" :key="j">
                        <span>{{ link.title }}</span>
                        <a ref="copyButton" :href="link.link" class="bg-blue-500 text-white py-1 px-4 rounded">دانلود</a>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import type {Ref} from 'vue';
import LoadingSVG from "@/components/icons/LoadingSVG.vue";
import {fetchMovieLinks} from "@/utils/fetchMovieLinks";
import {fetchSeriesLinks} from "@/utils/fetchSeriesLinks";

const props = defineProps<{
  href: string
  type: string
}>();

const emit = defineEmits(['return']);
const links: Ref<Array<any>> = ref([]);
const isLoading = ref(true);
const copyButton = ref([]);
const linkCopied = ref(false);

onMounted(() => {
  if (props.type === 'movie') {
    fetchMovie();
  } else {
    fetchSeries();
  }
});

function copy(textToCopy: string) {
    navigator.clipboard.writeText(textToCopy);
    linkCopied.value = true;

    setTimeout(() => {
        linkCopied.value = false;
    }, 700);
}
async function fetchMovie() {
   const {data} = await fetchMovieLinks(props.href);
   links.value = data.value;
   isLoading.value = false;
}

async function fetchSeries() {
    const {data} = await fetchSeriesLinks(props.href);
    links.value = data.value;
    isLoading.value = false;

}
</script>

<style scoped>

.show-enter-active {
    animation: show .5s;
}
.show-leave-active {
    animation: show .5s reverse;
}
@keyframes show {
    0% {
        top: -40px;
    }
    100% {
        top: 0;
    }
}


svg {
    margin: 0 !important;
    padding: 0 !important;
    width: 64px !important;
    height: 64px !important;
}
</style>
