export function getRpcDatasetUuid(producer: string, dataset: string, year: number, month: number): string {
  return `${producer}_${dataset}_${year.toString()}_${month.toString()}`;
}