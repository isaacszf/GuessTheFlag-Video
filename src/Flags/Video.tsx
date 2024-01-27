import { AbsoluteFill, Sequence, Img, staticFile, Audio } from 'remotion'

import { Flag } from './components/Flag'
import { Presentation } from './components/Presentation'
import { Watermark } from './components/Watermark'

import { VideoProps } from './types'

import './font.css'

export const Video = ({ title, difficulty, data, gifUrl }: VideoProps) => {
  return (
    <AbsoluteFill style={{ fontFamily: 'Montserrat' }}>
      <AbsoluteFill style={{ background: '#000' }}>
        <Img
          style={{ width: '100%', height: '100%', filter: 'blur(7px)' }}
          src={gifUrl.includes('https') ? gifUrl : staticFile(gifUrl)}
        ></Img>
      </AbsoluteFill>

      <Sequence durationInFrames={160}>
        <Presentation title={title} difficulty={difficulty} />
      </Sequence>
      <Sequence from={163}>
        <Flag data={data} />
      </Sequence>

      <Watermark />

      <Audio src={staticFile('flags/audios/music.mp3')} volume={0.015} />
    </AbsoluteFill>
  )
}
