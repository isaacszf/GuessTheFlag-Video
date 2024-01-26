import fs from 'fs'
import axios from 'axios'

import { join } from 'path'

import { absolutePath } from '../utils'

const delay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const elevenLabsRequest = async (
  apiKey: string,
  voiceID: string,
  text: string,
  filename: string,
) => {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceID}`
  const response = await axios({
    method: 'POST',
    url,
    data: {
      text,
      voice_settings: {
        stability: 1,
        similarity_boost: 1,
      },
      model_id: 'eleven_multilingual_v2',
    },
    headers: {
      Accept: 'audio/mpeg',
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    responseType: 'stream',
  })

  response.data.pipe(fs.createWriteStream(filename))
  return { status: 'ok' }
}

const clearDirectory = (dir: string) => {
  fs.readdir(dir, (err, files) => {
    if (err) throw err

    for (const file of files) {
      fs.unlink(join(dir, file), err => {
        if (err) throw err
      })
    }
  })

  return true
}

export const generateAudios = async () => {
  const jsonRaw = fs.readFileSync(
    absolutePath('public/flags/flags.json'),
    'utf-8',
  )
  const json = JSON.parse(jsonRaw)

  const words = json['words']

  if (clearDirectory(absolutePath('public/flags/audios/flags'))) {
    for (const word of words) {
      await delay(2000)

      elevenLabsRequest(
        process.env.ELEVEN_LABS_API!,
        process.env.ELEVEN_LABS_VOICE_MODEL_ID!,
        word,
        absolutePath(`public/flags/audios/flags/${word}.mp3`),
      ).then(r => console.log(r))
    }
  }
}
