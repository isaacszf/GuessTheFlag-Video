import {
  AbsoluteFill,
  interpolate,
  staticFile,
  useCurrentFrame,
  Audio,
  Sequence,
} from 'remotion'

import { Difficulty } from '../../../lib/types/difficulty'

type Props = {
  title: string
  difficulty: Difficulty
}

const levelColor = (dif: Difficulty): string => {
  switch (dif) {
    case Difficulty.Easy:
      return 'lightgreen'
    case Difficulty.Medium:
      return 'yellow'
    case Difficulty.Hard:
      return 'red'
  }
}

const selectAudioByLevel = (dif: Difficulty): string => {
  switch (dif) {
    case Difficulty.Easy:
      return 'flags/audios/difficulty/easy.mp3'
    case Difficulty.Medium:
      return 'flags/audios/difficulty/medium.mp3'
    case Difficulty.Hard:
      return 'flags/audios/difficulty/hard.mp3'
  }
}

export const Presentation = ({ title, difficulty: level }: Props) => {
  const frame = useCurrentFrame()

  const levelOpacity = interpolate(frame, [69, 70], [0, 1], {
    extrapolateRight: 'clamp',
  })
  const difficultyOpacity = interpolate(frame, [83, 84], [0, 1])

  return (
    <AbsoluteFill
      style={{
        position: 'absolute',
        top: '23%',

        textAlign: 'center',
        fontWeight: 'bold',
        color: 'white',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '40px',

          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontSize: 120,
            width: '70%',
          }}
        >
          {title}
        </span>

        <span style={{ fontSize: 75, opacity: levelOpacity }}>
          NÍVEL:{' '}
          <span
            style={{ color: levelColor(level), opacity: difficultyOpacity }}
          >
            {level}
          </span>
        </span>
      </div>

      <Audio src={staticFile('flags/audios/title.mp3')} />
      <Sequence from={80}>
        <Audio src={staticFile(selectAudioByLevel(level))} />
      </Sequence>
    </AbsoluteFill>
  )
}
