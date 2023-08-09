import type { Ref } from 'vue';
import { ref } from 'vue';

export async function fetchMovieLinks(url: string): Promise<any> {
  const data: Ref<Array<any>> = ref([]);
  const error: Ref<Error> = ref({} as Error);

  const res: Response = await fetch('https://api.allorigins.win/raw?url=' + url);
  const body: string = await res.text();

  const parser: DOMParser = new DOMParser();
  const d: Document = parser.parseFromString(body, 'text/html');

  if (d?.querySelectorAll('.m9tlg')?.length) {
    for (let index: number = 0; index < d.querySelectorAll('.m9tlg').length; index++) {
      const nested: any[] = [];
      for (
        let j: number = 0;
        j < d?.querySelectorAll('.m9cgl')[index]?.querySelectorAll('.LinkWrapper')?.length;
        j++
      ) {
        nested.push({
          link: d
            ?.querySelectorAll('.m9cgl')
            [index]?.querySelectorAll('.LinkWrapper')
            [j]?.getElementsByTagName('a')[0]?.href,
          title: d
            ?.querySelectorAll('.m9cgl')
            [index]?.querySelectorAll('.LinkWrapper')
            [j]?.getElementsByTagName('a')[0]?.innerText,
          size: d
            ?.querySelectorAll('.m9cgl')
            [index]?.querySelectorAll('.LinkWrapper')
            [j]?.getElementsByTagName('span')[1]?.innerText
        });
      }

      data.value.push({
        title: d?.querySelectorAll('.m9tlg')[index]?.querySelector('h3')?.innerText,
        links: nested
      });
    }
  }
  return { data, error };
}
