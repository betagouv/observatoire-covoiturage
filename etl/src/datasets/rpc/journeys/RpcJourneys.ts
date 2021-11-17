import { AbstractDataset, ArchiveFileTypeEnum, FileTypeEnum } from '@betagouvpdc/perimeters';
import { DownloadError } from '@betagouvpdc/perimeters/dist/errors';
import axios from 'axios';

export class Rpc extends AbstractDataset {
  static producer = 'rpc';
  static dataset = 'journeys';
  static year = 2021;
  static table = 'aires_covoiturage_2021';
  readonly targetTable = 'registre_covoiturage';
  readonly url: string = 'https://www.data.gouv.fr/api/1/datasets/trajets-realises-en-covoiturage-registre-de-preuve-de-covoiturage/';
  readonly fileArchiveType: ArchiveFileTypeEnum = ArchiveFileTypeEnum.None;
  readonly rows: Map<string, [string, string]> = new Map([
    ['id_lieu', ['0', 'varchar']],
    ['nom_lieu', ['1', 'varchar']],
    ['ad_lieu', ['2', 'varchar']],
    ['com_lieu', ['3', 'varchar']],
    ['insee', ['4', 'varchar']],
    ['type', ['5', 'varchar']],
    ['date_maj', ['6', 'date']],
    ['ouvert', ['7', 'boolean']],
    ['source', ['8', 'varchar']],
    ['xlong', ['9', 'varchar']],
    ['ylat', ['10', 'varchar']],
    ['nbre_pl', ['11', 'varchar']],
    ['nbre_pmr', ['12', 'varchar']],
    ['duree', ['13', 'varchar']],
    ['horaires', ['14', 'varchar']],
    ['proprio', ['15', 'varchar']],
    ['lumiere', ['16', 'varchar']],
    ['comm', ['17', 'varchar']],
  ]);
  fileType: FileTypeEnum = FileTypeEnum.Csv;
  sheetOptions = {};
  urls: Set<string> = new Set();

  async getFilesUrl(): Promise<void>{
    const response = await axios.get(this.url)
    for(const ressource of response.data.ressources){
      if(ressource.title.indexOf('vf') > 0){
        this.urls.add(ressource.url)
      }
    }
  }

  async download(): Promise<void> {
    try {
      const filepaths: string[] = [];
      await this.getFilesUrl();
      this.urls.forEach(async (url) => {
        const filepath = await this.file.download(url);
        if (this.fileArchiveType !== ArchiveFileTypeEnum.None) {
          filepaths.push(...(await this.file.decompress(filepath, this.fileArchiveType, this.fileType)));
        } else {
          filepaths.push(filepath);
        }
      })
      this.filepaths = filepaths;
    } catch (e) {
      throw new DownloadError(this, (e as Error).message);
    }
  }

}