import fs from 'fs'
import { HTMLElement, parse } from 'node-html-parser'

import { Difficulty } from '../../lib/types/difficulty'
import { fetchData, absolutePath, sleep, randomElement } from '../utils'

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
      ]
      return cases.every(c => !anchor.attrs.href.includes(c))
    })
    .map(anchor => {
      return [
        anchor.attrs.title,
        `https://pt.wikipedia.org/${anchor.attrs.href}`,
      ]
    })

const getFlagsTitleAndImage = async (root: HTMLElement) => {
  let parsedLinks = []
  const links = getFlagsHref(root)

  for (const [title, link] of links) {
    await sleep(500)

    const flagName = title.split(' ').slice(2).join(' ')

    const data = await fetchData(link)
    const root = parse(data)

    const img = root.querySelector(`img[src*=Flag]`)

    if (img !== null) {
      parsedLinks.push({ name: flagName, image: `https:${img.attrs.src}` })
      console.log(`[SUCCESS] -  "${title}"`)
    } else {
      console.log(`[FAILURE] -  "${title}"`)
    }
  }

  return parsedLinks
}

const updateJson = (flagsList: any[]) => {
  const filename = 'public/flags/flags.json'
  const fullPath = absolutePath(filename)

  const names = flagsList.map(flag => flag.name)
  const images = flagsList.map(flag => flag.image)

  const content = {
    title: 'ADIVINHE A BANDEIRA',
    words: names,
    images: images,
    difficulty: randomElement([
      Difficulty.Hard,
      Difficulty.Medium,
      Difficulty.Easy,
    ]),
  }

  fs.writeFileSync(fullPath, JSON.stringify(content), 'utf8')

  console.log('Selected:', content.words)
  console.log('Difficulty:', content.difficulty)

  return
}

export const generateJSONWithAllFlags = async () => {
  const flagsUrl = 'https://pt.wikipedia.org/wiki/Categoria:Bandeiras_nacionais'

  try {
    const data = await fetchData(flagsUrl)
    const root = parse(data)

    const flagList = await getFlagsTitleAndImage(root)

    const creationPath = absolutePath('scraper/flags/all_flags.json')
    fs.writeFileSync(creationPath, JSON.stringify(flagList), 'utf-8')
  } catch (err) {
    console.error('[GenerateJSONWithAllFlags]: ', err)
  }
}

export const selectRandomFlags = async (numOfFlags: number) => {
  const path = absolutePath('scraper/flags/all_flags.json')
  const existsFileWithAllFlags = fs.existsSync(path)

  if (!existsFileWithAllFlags) await generateJSONWithAllFlags()

  try {
    const flagList = await import(path)
    const shuffledFL = [...flagList['default']]

    for (let i = shuffledFL.length - 1; i > 0; i--) {
      const index = Math.floor(Math.random() * (i + 1))
      ;[shuffledFL[i], shuffledFL[index]] = [shuffledFL[index], shuffledFL[i]]
    }

    const randomFlags = shuffledFL.slice(0, numOfFlags)
    return updateJson(randomFlags)
  } catch (err) {
    console.error('[SelectRandomFlags]: ', err)
  }
}
