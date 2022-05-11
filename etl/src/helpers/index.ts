import axios from 'axios';

export function getRpcDatasetUuid(producer: string, dataset: string, year: number, month: number): string {
  return `${producer}_${dataset}_${year.toString()}_${month.toString()}`;
}

export function getAiresDatasetUuid(producer: string, dataset: string, year: number): string {
  return `${producer}_${dataset}_${year.toString()}}`;
}

export async function getRpcFilesUrl(url: string): Promise<string[]> {
  const urls: string[] = [];
  const response = await axios.get(url);
  for (const resource of response.data.resources) {
    if (resource.title.indexOf('vf') < 0 && resource.title.indexOf('2019') < 0) {
      urls.push(resource.url);
    }
  }
  return urls;
}

export async function getAiresLastFileUrl(url: string): Promise<string> {
  const response = await axios.get(url);
  const fileUrl = response.data.history[0].payload.permanent_url
  return fileUrl;
}
