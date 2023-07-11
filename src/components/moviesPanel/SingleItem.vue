<template>
  <button class="text-white bg-secondary py-2 px-4 rounded" @click="emit('return')">بازگشت</button>
    <ul v-if="props.type === 'series'" class="h-[300px] overflow-y-auto w-[75%]">
        <li v-for="(item, i) in links" :key="i">
            <span class="text-white">{{ item.title }}</span>
            <span v-html="item.details" class="flex gap-3 text-green-400"></span>
            <ul class="mt-2">
                <li class="bg-yellow-400 py-2 px-8 rounded mb-4" v-for="(link, j) in item.links" :key="j">
                    <a :href="link.link">{{ link.spans }}</a>
                </li>
            </ul>
        </li>
    </ul>
    <ul v-else class="h-[300px] overflow-y-auto">
        <li v-for="(item, i) in links" :key="i">
            <span class="text-white">{{ item.title }}</span>
            <ul class="mt-2">
                <li class="bg-yellow-400 py-2 px-8 rounded mb-4" v-for="(link, j) in item.links" :key="j">
                    <a :href="link.link">{{ link.title }}</a>
                </li>
            </ul>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = defineProps<{
  href: string
  type: string
}>()

const emit = defineEmits(['return'])
const links = ref([])

onMounted(() => {
  if (props.type === 'movie') {
    fetchMovie()
  } else {
    fetchSeries()
  }
})

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
  )
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
  )
}
</script>

<style scoped></style>
