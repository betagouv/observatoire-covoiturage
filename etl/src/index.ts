import { perimeters } from './tasks/perimeters'
import { aire_covoit } from './tasks/aire_covoit'
import { registre_covoit } from './tasks/registre_covoit'

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