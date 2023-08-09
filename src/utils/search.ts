export async function search(url: string):Promise<any> {
    const data: Array<any> = [];
    let error: any = null;

    const d: DOMParser = new DOMParser();

   try {
       const res: Response = await  fetch(url);
       const body: Array<any> = await res.json();

       for (let i: number = 0; i < body.length; i++) {
           const title: string = body[i].title.rendered;
           const link: string = body[i].link;
           const thumb: string = d
               .parseFromString(body[i].content.rendered, 'text/html')
               .getElementsByTagName('img')[0].src;

           data.push({ title, link, thumb });
       }
   }catch (e: any) {
       error = e;
   }

    return {data, error};
}