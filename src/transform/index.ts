import xlsx from 'xlsx'
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