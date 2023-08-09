import type { Ref } from 'vue';
import { ref } from 'vue';

export async function fetchSeriesLinks(url: string):Promise<any> {
  const data: Ref<Array<any>> = ref([]);
  const error: Ref<Error> = ref({} as Error);

  const res: Response = await fetch('https://api.allorigins.win/raw?url=' + url);
  const body: string = await res.text();

  const parser: DOMParser = new DOMParser();
  const d: Document = parser.parseFromString(body, 'text/html');

  if (d?.querySelectorAll('.m9seriedl')?.length) {
    for (let index: number = 0; index < d?.querySelectorAll('.m9seriedl')?.length; index++) {
      const nested: any[] = [];
      for (
        let j: number = 0;
        j < d?.querySelectorAll('.m9seriedl')[index]?.getElementsByTagName('a')?.length;
        j++
      ) {
        nested.push({
          link: d?.querySelectorAll('.m9seriedl')[index]?.getElementsByTagName('a')[j]?.href,
          spans: d?.querySelectorAll('.m9seriedl')[index]?.getElementsByTagName('a')[j]?.innerText
        });
      }
      data.value.push({
        title: (
          d?.querySelectorAll('.m9seriedl')[index]?.childNodes[0] as HTMLElement
        )?.querySelector('h3')?.innerText,
        links: nested,
        details: d?.querySelectorAll('.m9tlg')[index]?.getElementsByTagName('span')[0]?.innerHTML
      });
    }
  }

  return { data, error };
}
