import axios from 'axios'

import { join } from 'path'

export const absolutePath = (filename: string) => join(process.cwd(), filename)

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

export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))
