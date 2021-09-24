import fs from 'fs'
import axios, { AxiosResponse } from 'axios'
import ora from 'ora'
import extract from 'extract-zip'
import {createGunzip} from 'zlib'
import { extractFull } from 'node-7z'

export const checkIfFileExist = function(path:string, url:string, file?:string):boolean{
  if(file){
    return fs.existsSync(path+'/'+file)
  } else {
    const split = url.split('/')
    const filename = split[split.length-1]
    return fs.existsSync(path+'/'+filename)
  }
}

export const downloadFile = async function(path:string, url: string, file?:string):Promise<void>{
  const spinner = ora()
  try{
    if(checkIfFileExist(path,url,file)){
      spinner.succeed('File already downloaded')
    } else {
      spinner.start('Downloading file')    
      const response = await axios.get(url,{responseType: 'stream'})
      const contentDisposition =response.headers['content-disposition']
      if(contentDisposition && contentDisposition.indexOf("filename=")!== -1){
        const startIndex = contentDisposition.indexOf("filename=") + 10
        const endIndex = contentDisposition.length - 1
        const filename = contentDisposition.substring(startIndex, endIndex)
        await writeFile(response,path,filename)
        spinner.succeed(filename+' downloaded')
        if (response.headers['content-type'] === 'application/zip'){
          spinner.start('Extracting files from '+filename)
          await extract(path+filename,{dir:path})
          spinner.succeed()
        }
      }else {
        const filename = file || 'unknown'
        await writeFile(response,path,filename)
        if(filename.endsWith('.gz')){
          spinner.start('Extracting file from '+filename)
          await ungzFile(path,filename)
          spinner.succeed(filename+' ungz')
        }
        else if(filename.endsWith('.7z')){
          spinner.start('Extracting file from '+filename)
          await un7zFile(path,filename)
          spinner.succeed(filename+' un7z')
        } 
        else if (filename.endsWith('.zip')){
          spinner.start('Extracting file from '+filename)
          await extract(path+filename,{dir:path})
          spinner.succeed(filename+' unzip')
        }
        spinner.succeed(filename+' downloaded')
      }
    }
  }
  catch(err){
    spinner.fail('Error during download...')
    console.log(err)
  }
}

export const writeFile =function(response:AxiosResponse, path:string, filename:string):Promise<void>{
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(path+filename)
    response.data.pipe(file)
    file.on('finish', resolve)
    file.on('error',  reject)
  })
}

export const ungzFile = function(path:string,filename:string):Promise<void>{
  return new Promise((resolve, reject) => {
    const ungzname = filename.slice(0,-3)
    const fileContents = fs.createReadStream(path+filename)
    const writeStream = fs.createWriteStream(path+ungzname)
    const unzip = createGunzip()
    const file=fileContents.pipe(unzip)
    file.pipe(writeStream)
    file.on('finish', resolve)
    file.on('error',  reject)
  })
}
export const un7zFile = function(path:string,filename:string):Promise<void>{
  return new Promise((resolve, reject) => {
    const stream = extractFull(path+filename,path)
    stream.on('end', resolve)
    stream.on('error', reject)
  })
}
