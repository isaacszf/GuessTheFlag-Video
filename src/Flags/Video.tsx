import { AbsoluteFill, Sequence, Img, staticFile } from 'remotion'

import { Flag } from './components/Flag'
import { Presentation } from './components/Presentation'
import { Watermark } from './components/Watermark'

import { VideoProps } from './types'

import './font.css'

export const Video = ({ title, difficulty, data, gifUrl }: VideoProps) => {
  return (
    <AbsoluteFill style={{ fontFamily: 'Montserrat' }}>
      <AbsoluteFill>
        <Img
          style={{ width: '100%', height: '100%' }}
          src={
            gifUrl.includes('https') ? gifUrl : staticFile(`guess/${gifUrl}`)
          }
        ></Img>
      </AbsoluteFill>

      <Sequence durationInFrames={160}>
        <Presentation title={title} difficulty={difficulty} />
      </Sequence>
      <Sequence from={163}>
        <Flag data={data} />
      </Sequence>

      <Watermark />
    </AbsoluteFill>
  )
}
