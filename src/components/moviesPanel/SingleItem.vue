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
                        <a :href="link.link">{{ link.spans }}</a>
                        <button ref="copyButton" @click="copy(link.link)" class="bg-blue-500 text-white py-1 px-4 rounded">کپی</button>
                    </li>
                </ul>
            </li>
        </ul>
        <ul v-else class="h-[300px] overflow-y-auto w-full">
            <li class="w-[400px]" v-for="(item, i) in links" :key="i">
                <span class="text-white">{{ item.title }}</span>
                <ul class="mt-2">
                    <li class="bg-yellow-400 py-2 px-8 rounded mb-4" v-for="(link, j) in item.links" :key="j">
                        <a :href="link.link">{{ link.title }}</a>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import {onMounted, ref, toRef} from 'vue'
import type Ref from 'vue'
import LoadingSVG from "@/assets/icons/LoadingSVG.vue";

const props = defineProps<{
  href: string
  type: string
}>()

const emit = defineEmits(['return'])
const links: Ref<Array<any>> = ref([])
const isLoading = ref(true);
const copyButton = ref([]);
const linkCopied = ref(false);

onMounted(() => {
  if (props.type === 'movie') {
    fetchMovie()
  } else {
    fetchSeries()
  }
})

function copy(textToCopy) {
    navigator.clipboard.writeText(textToCopy);
    linkCopied.value = true;

    setTimeout(() => {
        linkCopied.value = false
    }, 700);
}
function fetchMovie() {
  fetch('https://api.allorigins.win/raw?url=' + props.href).then((res) =>
    res.text().then((body) => {
      const parser = new DOMParser()
      const d = parser.parseFromString(body, 'text/html')
      for (let index = 0; index < d.querySelectorAll('.m9tlg').length; index++) {
        const nested = []
        for (
          let j = 0;
          j < d.querySelectorAll('.m9cgl')[index].querySelectorAll('.LinkWrapper').length;
          j++
        ) {
          nested.push({
            link: d
              .querySelectorAll('.m9cgl')
              [index].querySelectorAll('.LinkWrapper')
              [j].getElementsByTagName('a')[0]?.href,
            title: d
              .querySelectorAll('.m9cgl')
              [index].querySelectorAll('.LinkWrapper')
              [j].getElementsByTagName('a')[0]?.innerText,
            size: d
              .querySelectorAll('.m9cgl')
              [index].querySelectorAll('.LinkWrapper')
              [j].getElementsByTagName('span')[1]?.innerText
          })
        }

        links.value.push({
          title: d.querySelectorAll('.m9tlg')[index].querySelector('h3').innerText,
          links: nested
        })
      }
    })
  ).then(() => {
      isLoading.value = false
  })
}

function fetchSeries() {
  fetch('https://api.allorigins.win/raw?url=' + props.href).then((res) =>
    res.text().then((body) => {
      const parser = new DOMParser()
      const d = parser.parseFromString(body, 'text/html')
      for (let index = 0; index < d.querySelectorAll('.m9seriedl').length; index++) {
        const nested = []
        for (
          let j = 0;
          j < d.querySelectorAll('.m9seriedl')[index].getElementsByTagName('a').length;
          j++
        ) {
          nested.push({
            link: d.querySelectorAll('.m9seriedl')[index].getElementsByTagName('a')[j].href,
            spans: d.querySelectorAll('.m9seriedl')[index].getElementsByTagName('a')[j].innerText,
          })
        }
        links.value.push({
          title: d.querySelectorAll('.m9seriedl')[index].childNodes[0].querySelector('h3')
            .innerText,
          links: nested,
            details: d.querySelectorAll('.m9tlg')[index].getElementsByTagName('span')[0].innerHTML
        })
      }
    })
  ).then(() => {
      isLoading.value = false
  })
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
