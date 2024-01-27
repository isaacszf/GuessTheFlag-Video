import {
  AbsoluteFill,
  Audio,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  spring,
} from 'remotion'

import { Flag as FlagType } from '../../../lib/types/flag'
import { useEffect, useState } from 'react'
import { Counter } from './Counter'

type Props = { data: FlagType[] }

export const Flag = ({ data }: Props) => {
  const [frameNameAudio, setFrameNameAudio] = useState(0)
  const [frameTickTockAudio, setFrameTickTockAudio] = useState(0)

  const { fps } = useVideoConfig()
  const frame = useCurrentFrame()

  const appearSeconds = 5

  const nameAppearanceDuration = appearSeconds * fps // 5 segundos para o nome aparecer
  const waitAfterNameDuration = 2 * fps // 2 segundos após o nome aparecer
  const totalDuration = nameAppearanceDuration + waitAfterNameDuration // Duração total de cada ciclo

  // Calcula o índice da bandeira atual
  const index = Math.floor(frame / totalDuration) % data.length

  // Determina se deve mostrar o nome (após 5 segundos da bandeira aparecer)
  const shouldShowName = frame % totalDuration >= nameAppearanceDuration

  // Dados da bandeira atual
  const name = data[index][0]
  const link = data[index][1]

  // Animation
  const resetFrame = Math.floor(frame / totalDuration) * totalDuration
  const scale = spring({ fps: fps - 5, frame: frame - resetFrame })

  useEffect(() => {
    if (shouldShowName) {
      setFrameNameAudio(frame)
    } else {
      setFrameTickTockAudio(frame)
    }
  }, [index, shouldShowName])

  return (
    <AbsoluteFill>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '54px',
          justifyContent: 'center',
          color: 'white',

          position: 'absolute',
          left: 0,
          right: 0,
          top: '30%',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '32px',
          }}
        >
          {!shouldShowName && (
            <div style={{ position: 'absolute', top: -300 }}>
              <Counter seconds={appearSeconds} />
            </div>
          )}
          <img
            src={link}
            style={{ width: '600px', transform: `scale(${scale})` }}
          />
        </div>

        {shouldShowName && (
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '100px', fontWeight: 'bold' }}>
              {name}
            </span>
            <Sequence from={frameNameAudio}>
              <Audio
                src={staticFile(`flags/audios/flags/${name}.mp3`)}
                volume={0.5}
              />
            </Sequence>
          </div>
        )}

        {!shouldShowName && (
          <Sequence from={frameTickTockAudio}>
            <Audio
              src={staticFile(`flags/audios/tick-tock.mp3`)}
              volume={0.4}
            />
          </Sequence>
        )}
      </div>
    </AbsoluteFill>
  )
}
