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

type Props = { data: FlagType[] }

export const Flag = ({ data }: Props) => {
  const [frameNameAudio, setFrameNameAudio] = useState(0)
  const [frameTickTockAudio, setFrameTickTockAudio] = useState(0)

  const { fps } = useVideoConfig()
  const frame = useCurrentFrame()

  const nameAppearanceDuration = 4 * fps // 4 segundos para o nome aparecer
  const waitAfterNameDuration = 2 * fps // 2 segundos após o nome aparecer
  const totalDuration = nameAppearanceDuration + waitAfterNameDuration // Duração total de cada ciclo

  // Calcula o índice da bandeira atual
  const index = Math.floor(frame / totalDuration) % data.length

  // Determina se deve mostrar o nome (após 4 segundos da bandeira aparecer)
  const shouldShowName = frame % totalDuration >= nameAppearanceDuration

  // Dados da bandeira atual
  const name = data[index][0]
  const link = data[index][1]

  // Animation
  const resetFrame = Math.floor(frame / totalDuration) * totalDuration
  let scale = spring({ fps: fps - 20, frame: frame - resetFrame })

  useEffect(() => {
    if (shouldShowName) {
      setFrameNameAudio(frame)
    } else {
      setFrameTickTockAudio(frame)
      scale = spring({ fps: fps, frame: frameTickTockAudio })
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
        <img
          src={link}
          style={{ width: '600px', transform: `scale(${scale})` }}
        />

        {shouldShowName && (
          <div>
            <span style={{ fontSize: '100px', fontWeight: 'bold' }}>
              {name}
            </span>
            <Sequence from={frameNameAudio}>
              <Audio src={staticFile(`flags/audios/flags/${name}.mp3`)} />
            </Sequence>
          </div>
        )}

        {!shouldShowName && (
          <Sequence from={frameTickTockAudio}>
            <Audio src={staticFile(`flags/audios/tick-tock.mp3`)} />
          </Sequence>
        )}
      </div>
    </AbsoluteFill>
  )
}
