import { Difficulty } from '../../lib/types/difficulty'
import { Flag } from '../../lib/types/flag'

export type VideoProps = {
  title: string
  difficulty: Difficulty
  data: Flag[]
  seconds: number
  gifUrl: string
}
