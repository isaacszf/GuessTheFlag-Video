import 'dotenv/config'

import { selectRandomFlags } from './flags'
import { generateAudios } from './audio'

let numOfFlags = 5
const envNumOfFlags = process.env.NUM_OF_FLAGS

if (envNumOfFlags !== undefined) {
  const parsedNumOfFlags = parseInt(envNumOfFlags, 10)
  if (!isNaN(parsedNumOfFlags) && parsedNumOfFlags > 0) {
    numOfFlags = parsedNumOfFlags
  }
}

selectRandomFlags(numOfFlags)
  .then(() => {
    console.log('\nGenerating audios:')
    return generateAudios()
  })
  .catch(error => {
    console.error('An error occurred', error)
  })
