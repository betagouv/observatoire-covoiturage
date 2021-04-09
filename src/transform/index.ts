import xlsx from 'xlsx'
import mapshaper from 'mapshaper'
import ora from 'ora'


export const readXlsx = async function(path:string,filename: string,sheetname: string,startRow: number):Promise<unknown>{ 
  const spinner = ora()
  try{
    spinner.start('Reading file '+filename)
    const file = xlsx.readFile(path+filename)
    const data = xlsx.utils.sheet_to_json(file.Sheets[sheetname],{range:startRow})
    spinner.succeed(filename+' extracted')
    return data
  }
  catch(err){
    spinner.fail('Error during reading file '+filename)
    console.log(err)
  }
}

export const convertGeoFile = async function(path:string,filename: string,outPath: string,outFilename: string,format: string,precision: number,simplify?:string):Promise<void>{ 
  const spinner = ora()
  try{
    spinner.start('Simplify file '+filename)
    if(simplify === undefined){
      await mapshaper.runCommands('-i '+path+filename+' -o '+outPath+outFilename+' format='+format+' precision='+precision)
    }else{
      await mapshaper.runCommands('-i '+path+filename+' '+simplify+' -o '+outPath+outFilename+' format='+format+' precision='+precision)
    }
    spinner.succeed(filename+' extracted')
  }
  catch(err){
    spinner.fail('Error during simplifying file '+filename)
    console.log(err)
  }
}