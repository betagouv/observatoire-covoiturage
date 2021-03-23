import { perimeters } from './perimeters'
import { aire_covoit } from './aire_covoit'

async function main(){
  try{
    //await perimeters()
    await aire_covoit()  
  }
  catch(err){
    console.log(err)
    process.exit(1)
  }  
}

main()