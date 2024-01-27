import { Composition } from 'remotion'

import { Video as FlagsVideo } from './Flags/Video'
import { Flag } from '../lib/types/flag'

import flagJson from '../public/flags/flags.json'
import { Difficulty } from '../lib/types/difficulty'

export const RemotionRoot: React.FC = () => {
  const title = flagJson['title']
  const difficulty = flagJson['difficulty'] as Difficulty
  const words = flagJson['words']
  const images = flagJson['images']
  const gifUrl = 'flags/space.gif'

  const data = words.map((word, index) => [word, images[index]]) as Flag[]
  const seconds = data.length + 1
  const fps = 40

  return (
    <>
      <Composition
        id="Flags"
        component={FlagsVideo}
        durationInFrames={900}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={{ title, difficulty, data, seconds, gifUrl }}
        calculateMetadata={async _ => {
          const segmentDurationInFrames = 8 * fps
          const totalSegmentsDuration = segmentDurationInFrames * data.length
          const dur = totalSegmentsDuration + 150

          return {
            durationInFrames: dur,
          }
        }}
      />
    </>
  )
}
