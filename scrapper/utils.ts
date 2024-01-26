import axios from 'axios'

import { join } from 'path'

export const absolutePath = (filename: string) => join(process.cwd(), filename)

export const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export const fetchData = async (url: string) => {
  try {
    const resp = await axios.get(url)
    return resp.data
  } catch (err) {
    throw err
  }
}

export const randomElement = (arr: any[]) =>
  arr[Math.floor(Math.random() * arr.length)]
