import { perimeters } from './perimeters'
import { aire_covoit } from './aire_covoit'
import { registre_covoit } from './registre_covoit'

async function main(){
  try{
    await perimeters()
    await aire_covoit()
    await registre_covoit()
    console.log("All done")
    process.exit()  
  }
  catch(err){
    console.log(err)
    process.exit(1)
  }  
}

main()