import axios from 'axios';

export function getRpcDatasetUuid(producer: string, dataset: string, year: number, month: number): string {
  return `${producer}_${dataset}_${year.toString()}_${month.toString()}`;
}

export async function getFilesUrl(url: string): Promise<string[]> {
  const urls: string[] = [];
  const response = await axios.get(url);
  for (const resource of response.data.resources) {
    if (resource.title.indexOf('vf') < 0 && resource.title.indexOf('2019') < 0 ) {
      urls.push(resource.url);
    }
  }
  return urls;
}
