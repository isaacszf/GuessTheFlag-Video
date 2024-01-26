import { HTMLElement, parse } from 'node-html-parser'
import fs from 'fs'

import { fetchData, randomElement, shuffleArray, absolutePath } from '../utils'
import { Difficulty } from '../../lib/types/difficulty'
import { Flag } from '../../lib/types/flag'

type Flags = {
  words: Flag[]
  images: Flag[]
}

const getFlagsHref = (root: HTMLElement) =>
  root
    .querySelectorAll('a')
    .filter(anchor => {
      const cases = ['dos', 'das', 'do', 'da', 'de']
      return cases.some(c => anchor.attrs.href.includes(`Bandeira_${c}`))
    })
    .filter(anchor => {
      const cases = [
        'Ilha',
        'Ilhas',
        'Nova Caledónia',
        'República Turca de Chipre do Norte',
        'Antilhas Neerlandesas',
        'Pitcairn',
        'Guernsey',
        'Estados Federados da Micronésia',
        'Brasil',
      ]
      return cases.every(c => !anchor.attrs.href.includes(c))
    })
    .map(anchor => {
      return [
        anchor.attrs.title,
        `https://pt.wikipedia.org/${anchor.attrs.href}`,
      ]
    })

const getFlagsTitleAndImage = async (
  root: HTMLElement,
  numElements: number,
): Promise<Flag[][]> => {
  let parsedLinks = []
  const links = shuffleArray(getFlagsHref(root)).slice(0, numElements)

  for (const [title, link] of links) {
    const parsedTitle = title.split(' ').slice(2).join(' ')
    const data = await fetchData(link)
    const root = parse(data)

    let img = root.querySelector(`img[alt*="Bandeira"]`)
    img === null ? (img = root.querySelector('a.image img')) : img

    if (img !== null) {
      parsedLinks.push([parsedTitle, `https:${img.attrs.src}`])
      console.log(`[SUCCESS] -  "${title}"`)
    } else {
      console.log(`[FAILURE] -  "${title}"`)
    }
  }

  return parsedLinks
}

const updateJson = (updatedJson: Flags, path: string) => {
  const filename = 'public/flags/flags.json'
  const fullPath = absolutePath(filename)

  const content = {
    title: 'ADIVINHE A BANDEIRA',
    words: updatedJson.words,
    images: updatedJson.images,
    difficulty: randomElement([
      Difficulty.Hard,
      Difficulty.Medium,
      Difficulty.Easy,
    ]),
  }

  fs.writeFileSync(fullPath, JSON.stringify(content), 'utf8')
}

export const generateJSON = async (numOfFlags: number) => {
  const flagsUrl = 'https://pt.wikipedia.org/wiki/Categoria:Bandeiras_nacionais'

  const data = await fetchData(flagsUrl)
  const root = parse(data)

  console.log('Getting flags...')

  const flags = await getFlagsTitleAndImage(root, numOfFlags)

  const result: Flags = {
    words: [] as Flag[],
    images: [] as Flag[],
  }

  flags.forEach(flag => {
    result.words.push(flag[0])
    result.images.push(flag[1])
  })

  updateJson(result, '../public/flags/flags.json')
  console.log("Saved at 'public/flags/flags.json'")

  return
}
