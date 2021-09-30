import { join } from 'path'
import { downloadFile } from '../extract'
import {PoolClient} from 'pg'
import pgConnection from '../database/connection'
import {execQuery, importCSV, importXLSX, importGeojson} from '../load'
import {convertGeoFile} from '../transform'


async function inseeDownload(){
  const path =join(__dirname, '../../assets/insee/')
  await Promise.all([
    downloadFile(path,'https://www.insee.fr/fr/statistiques/fichier/5057840/commune2021-csv.zip'),
    downloadFile(path,'https://www.insee.fr/fr/statistiques/fichier/5057840/mvtcommune2021-csv.zip'),
    downloadFile(path,'https://www.insee.fr/fr/statistiques/fichier/2510634/Intercommunalite_Metropole_au_01-01-2019.zip'),
    downloadFile(path,'https://www.insee.fr/fr/statistiques/fichier/2510634/Intercommunalite_Metropole_au_01-01-2020_v1.zip'),
    downloadFile(path,'https://www.insee.fr/fr/statistiques/fichier/2510634/Intercommunalite_Metropole_au_01-01-2021.zip'),
    downloadFile(path,'https://www.insee.fr/fr/statistiques/fichier/5057840/departement2021-csv.zip'),
    downloadFile(path,'https://www.insee.fr/fr/statistiques/fichier/5057840/region2021-csv.zip'),
    downloadFile(path,'https://www.insee.fr/fr/statistiques/fichier/5057840/pays2021-csv.zip'),
  ])
}

async function ceremaDownload(){
  const path =join(__dirname, '../../assets/cerema/')
  await Promise.all([
    downloadFile(path,'http://www.cerema.fr/system/files/documents/2019/07/base_rt_2019_-_v1-1_-_version_diffusable_0.ods','aom_2019.ods'),
    downloadFile(path,'https://www.cerema.fr/system/files/documents/2020/07/base_rt_2020_v1-1_diffusion_0.ods','aom_2020.ods'),
    downloadFile(path,'https://www.cerema.fr/system/files/documents/2021/06/base_rt_2021_v4_diffusion.xlsx','aom_2021.xlsx')
  ])
}

async function geoDownload(){
  let path =join(__dirname, '../../assets/ign/')
  await Promise.all([
    downloadFile(path,'http://files.opendatarchives.fr/professionnels.ign.fr/adminexpress/ADMIN-EXPRESS-COG_2-0__SHP__FRA_WGS84G_2019-09-24.7z','admin-express-2019.7z'),
    downloadFile(path,'http://files.opendatarchives.fr/professionnels.ign.fr/adminexpress/ADMIN-EXPRESS-COG_2-1__SHP__FRA_WGS84G_2020-11-20.7z','admin-express-2020.7z')
  ])
  path = join(__dirname, '../../assets/eurostat/') 
  await downloadFile(path,'https://gisco-services.ec.europa.eu/distribution/v2/countries/geojson/CNTR_RG_60M_2020_4326.geojson','countries_2020.geojson')
}

async function geoTransform(){
  const path2019 =join(__dirname, '../../assets/ign/ADMIN-EXPRESS-COG_2-0__SHP__FRA_2019-09-24/ADMIN-EXPRESS-COG/1_DONNEES_LIVRAISON_2019-09-24/ADE-COG_2-0_SHP_WGS84_FR/')
  const path2020 =join(__dirname, '../../assets/ign/ADMIN-EXPRESS-COG_2-1__SHP__FRA_2020-11-20/ADMIN-EXPRESS-COG/1_DONNEES_LIVRAISON_2020-11-20/ADE-COG_2-1_SHP_WGS84G_FRA/')
  await Promise.all([
    convertGeoFile(path2019,'COMMUNE_CARTO.shp',join(__dirname, '../../assets/ign/'),'communes_2019.geojson','geojson',0.000001,'-simplify dp interval=100 keep-shapes'),
    convertGeoFile(path2019,'CHEF_LIEU_CARTO.shp',join(__dirname, '../../assets/ign/'),'chefs_lieux_2019.geojson','geojson',0.000001),
    convertGeoFile(path2020,'COMMUNE.shp',join(__dirname, '../../assets/ign/'),'communes_2020.geojson','geojson',0.000001,' '+path2020+'ARRONDISSEMENT_MUNICIPAL.shp combine-files -merge-layers force -simplify 60%'),
    convertGeoFile(path2020,'CHEF_LIEU_CARTO.shp',join(__dirname, '../../assets/ign/'),'chefs_lieux_2020.geojson','geojson',0.000001,' '+path2020+'CHFLIEU_ARRONDISSEMENT_MUNICIPAL.shp combine-files -merge-layers force')
  ])
  // 2 simplifications supplémentaires pour la couche communes_2020
  await convertGeoFile(join(__dirname, '../../assets/ign/'),'communes_2020.geojson','force '+join(__dirname, '../../assets/ign/'),'communes_2020.geojson','geojson',0.000001,'-simplify 50% keep-shapes')
  await convertGeoFile(join(__dirname, '../../assets/ign/'),'communes_2020.geojson','force '+join(__dirname, '../../assets/ign/'),'communes_2020.geojson','geojson',0.000001,'-simplify 40% keep-shapes')
}

async function tablesCreation(client:PoolClient){
  const path =join(__dirname, '../database/sql/perimeters/')
  await execQuery(client,path,'create_schema_perimeters.sql')
  await Promise.all([
    execQuery(client,path,'create_table_insee_mvt_communes.sql'),
    execQuery(client,path,'create_table_insee_com_2021.sql'),
    execQuery(client,path,'create_table_passage_arr.sql'),
    execQuery(client,path,'create_table_insee_perim_2019.sql'),
    execQuery(client,path,'create_table_insee_perim_2020.sql'),
    execQuery(client,path,'create_table_insee_perim_2021.sql'),
    execQuery(client,path,'create_table_cerema_aom_2019.sql'),
    execQuery(client,path,'create_table_cerema_aom_2020.sql'),
    execQuery(client,path,'create_table_cerema_aom_2021.sql'),
    execQuery(client,path,'create_table_insee_dep_2021.sql'),
    execQuery(client,path,'create_table_insee_reg_2021.sql'),
    execQuery(client,path,'create_table_insee_pays_2021.sql')
  ])
}
async function tablesGeoCreation(client:PoolClient){
  const path =join(__dirname, '../database/sql/perimeters/')
  await Promise.all([
    execQuery(client,path,'create_table_communes_2019.sql'),
    execQuery(client,path,'create_table_communes_2020.sql'),
    execQuery(client,path,'create_table_chefs_lieux_2019.sql'),
    execQuery(client,path,'create_table_chefs_lieux_2020.sql'),
    execQuery(client,path,'create_table_countries.sql')
  ])
}

async function importData(client:PoolClient){
  await Promise.all([
    // import mvtcommune2021.csv
    importCSV(client,
      {
        path: join(__dirname, '../../assets/insee/'),
        filename:'mvtcommune2021.csv',
      },
      {
        path: join(__dirname, '../database/sql/perimeters/'),
        filename:'insert_table_insee_mvt_communes.sql',
      }
    ),
    // import commune2021.csv
    importCSV(client,
      {
        path: join(__dirname, '../../assets/insee/'),
        filename:'commune2021.csv',
      },
      {
        path: join(__dirname, '../database/sql/perimeters/'),
        filename:'insert_table_insee_com_2021.sql',
      }
    ),
    // import Intercommunalite_Metropole_au_01-01-2019.xls
    importXLSX(client,{
      path: join(__dirname, '../../assets/insee/'),
      filename:'Intercommunalite_Metropole_au_01-01-2019.xls',
      sheet: 'Composition_communale',
      startRow: 5
    },
    {
      path: join(__dirname, '../database/sql/perimeters/'),
      filename:'insert_table_insee_perim_2019.sql',
    }),
    // import Intercommunalite_Metropole_au_01-01-2020.xlsx
    importXLSX(client,{
      path: join(__dirname, '../../assets/insee/'),
      filename:'Intercommunalite_Metropole_au_01-01-2020.xlsx',
      sheet: 'Composition_communale',
      startRow: 5
    },
    {
      path: join(__dirname, '../database/sql/perimeters/'),
      filename:'insert_table_insee_perim_2020.sql',
    }),
    // import Intercommunalite_Metropole_au_01-01-2021.xlsx
    importXLSX(client,{
      path: join(__dirname, '../../assets/insee/'),
      filename:'Intercommunalite-Metropole_au_01-01-2021.xlsx',
      sheet: 'Composition_communale',
      startRow: 5
    },
    {
      path: join(__dirname, '../database/sql/perimeters/'),
      filename:'insert_table_insee_perim_2021.sql',
    }),
    // import aom_2019.ods
    importXLSX(client,{
      path: join(__dirname, '../../assets/cerema/'),
      filename:'aom_2019.ods',
      sheet: 'RT 2019- Composition communale',
      startRow: 0
    },
    {
      path: join(__dirname, '../database/sql/perimeters/'),
      filename:'insert_table_cerema_aom_2019.sql',
    }),
    // import aom_2020.ods
    importXLSX(client,{
      path: join(__dirname, '../../assets/cerema/'),
      filename:'aom_2020.ods',
      sheet: 'RT_2020_-_Composition_communale',
      startRow: 0
    },
    {
      path: join(__dirname, '../database/sql/perimeters/'),
      filename:'insert_table_cerema_aom_2020.sql',
    }),
    // import aom_2021.xlsx
    importXLSX(client,{
      path: join(__dirname, '../../assets/cerema/'),
      filename:'aom_2021.xlsx',
      sheet: 'RT_2021_-_Composition_communale',
      startRow: 0
    },
    {
      path: join(__dirname, '../database/sql/perimeters/'),
      filename:'insert_table_cerema_aom_2021.sql',
    }),
    // import departement2021.csv
    importCSV(client,
      {
        path: join(__dirname, '../../assets/insee/'),
        filename:'departement2021.csv',
      },
      {
        path: join(__dirname, '../database/sql/perimeters/'),
        filename:'insert_table_insee_dep_2021.sql',
      }
    ),
    // import region2021.csv
    importCSV(client,
      {
        path: join(__dirname, '../../assets/insee/'),
        filename:'region2021.csv',
      },
      {
        path: join(__dirname, '../database/sql/perimeters/'),
        filename:'insert_table_insee_reg_2021.sql',
      }
    ),
    // import pays2021.csv
    importCSV(client,
      {
        path: join(__dirname, '../../assets/insee/'),
        filename:'pays2021.csv',
      },
      {
        path: join(__dirname, '../database/sql/perimeters/'),
        filename:'insert_table_insee_pays_2021.sql',
      }
    )
  ])
  // insert data in table perimeters.passage_arr
  await execQuery(client,join(__dirname, '../database/sql/perimeters/'),'insert_table_passage_arr.sql')
}

async function importGeo(client:PoolClient){
  await Promise.all([
    // import communes_2019.geojson
    importGeojson(client,
      {
        path: join(__dirname, '../../assets/ign/'),
        filename:'communes_2019.geojson',
      },
      {
        path: join(__dirname, '../database/sql/perimeters/'),
        filename:'insert_table_communes_2019.sql',
      }
    ),
    // import chefs_lieux_2019.geojson
    importGeojson(client,
      {
        path: join(__dirname, '../../assets/ign/'),
        filename:'chefs_lieux_2019.geojson',
      },
      {
        path: join(__dirname, '../database/sql/perimeters/'),
        filename:'insert_table_chefs_lieux_2019.sql',
      }
    ),
    // import communes_2020.geojson
    importGeojson(client,
      {
        path: join(__dirname, '../../assets/ign/'),
        filename:'communes_2020.geojson',
      },
      {
        path: join(__dirname, '../database/sql/perimeters/'),
        filename:'insert_table_communes_2020.sql',
      }
    ),
    // import chefs_lieux_2020.geojson
    importGeojson(client,
      {
        path: join(__dirname, '../../assets/ign/'),
        filename:'chefs_lieux_2020.geojson',
      },
      {
        path: join(__dirname, '../database/sql/perimeters/'),
        filename:'insert_table_chefs_lieux_2020.sql',
      }
    ),
    // import countries
    importGeojson(client,
      {
        path: join(__dirname, '../../assets/eurostat/'),
        filename:'countries_2020.geojson',
      },
      {
        path: join(__dirname, '../database/sql/perimeters/'),
        filename:'insert_table_countries.sql',
      }
    )
  ])
}

async function treatments(client:PoolClient){
  const path =join(__dirname, '../database/sql/perimeters/')
  await Promise.all([
    execQuery(client,path,'create_view_evolution_com.sql'),
    execQuery(client,path,'create_table_passage_com.sql'),
    execQuery(client,path,'create_table_communes_2021.sql'),
    execQuery(client,path,'create_table_chefs_lieux_2021.sql'),
    execQuery(client,path,'create_table_epci_2019.sql'),
    execQuery(client,path,'create_table_epci_2020.sql'),
    execQuery(client,path,'create_table_epci_2021.sql'),
    execQuery(client,path,'create_table_aom_2019.sql'),
    execQuery(client,path,'create_table_aom_2020.sql'),
    execQuery(client,path,'create_table_aom_2021.sql'),
    execQuery(client,path,'create_table_departements.sql'),
    execQuery(client,path,'create_table_regions.sql')
  ])
  await execQuery(client,path,'insert_table_passage_com.sql')
  await Promise.all([
    execQuery(client,path,'insert_table_communes_2021.sql'),
    execQuery(client,path,'insert_table_chefs_lieux_2021.sql'),
    execQuery(client,path,'insert_table_epci_2019.sql'),
    execQuery(client,path,'insert_table_epci_2020.sql'),
    execQuery(client,path,'insert_table_epci_2021.sql'),
    execQuery(client,path,'insert_table_aom_2019.sql'),
    execQuery(client,path,'insert_table_aom_2020.sql'),
    execQuery(client,path,'insert_table_aom_2021.sql'),
    execQuery(client,path,'insert_table_departements.sql'),
    execQuery(client,path,'insert_table_regions.sql')
  ])
  await execQuery(client,path,'drop_unused_tables.sql')
}

export const perimeters = async function():Promise<void>{
  const client = await pgConnection()
  try{
    await inseeDownload()
    await geoDownload()
    await ceremaDownload()
    await geoTransform()
    if(client){
      await tablesCreation(client)
      await tablesGeoCreation(client)
      await importData(client)
      await importGeo(client)
      await treatments(client)
    }else{
      throw console.log('No connection to DB')
    }
      
  }
  catch(err){
    console.log(err)
    process.exit(1)
  }  
}






