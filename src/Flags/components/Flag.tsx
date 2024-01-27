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
  const [startFrame, setStartFrame] = useState(0)

  const { fps } = useVideoConfig()
  const frame = useCurrentFrame()

  const appearSeconds = 5
  const waitAfterSeconds = 3
  const nameInterval = appearSeconds * 4 * 10

  const nameAppearanceDuration = appearSeconds * fps
  const waitAfterNameDuration = waitAfterSeconds * fps
  const totalDuration = nameAppearanceDuration + waitAfterNameDuration

  const index = Math.floor(frame / totalDuration) % data.length
  const shouldShowName = frame % totalDuration >= nameInterval

  const name = data[index][0]
  const link = data[index][1]

  const delay = data.length * ((appearSeconds + waitAfterSeconds) * 8)

  // Animation
  const resetFrame = Math.floor(frame / totalDuration) * totalDuration
  const scale = spring({ fps: fps - 5, frame: frame - resetFrame })

  useEffect(() => {
    if (shouldShowName) {
      if (index === 0) setFrameNameAudio(f => (f += nameInterval))
      if (index !== 0) setFrameNameAudio(f => (f += delay))
    }

    if (!shouldShowName) {
      if (index !== 0) {
        setFrameTickTockAudio(f => (f += delay))
        setStartFrame(frame)
      }
    }
  }, [shouldShowName])

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
              <Counter seconds={appearSeconds} startFrame={startFrame} />
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
