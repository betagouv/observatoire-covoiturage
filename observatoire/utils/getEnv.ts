export function getEnv(key: string): string {
  if (process.browser && window['env'] && window['env'][key]) {
    return window['env'][key];
  }
  return '';
}