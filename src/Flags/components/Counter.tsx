import { useCurrentFrame, useVideoConfig } from 'remotion'

type Props = {
  startFrame: number
  seconds: number
}

export const Counter = ({ startFrame, seconds }: Props) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const totalFrames = seconds * fps
  const framesLeft = startFrame + totalFrames - frame
  const timeLeft = Math.max(Math.ceil(framesLeft / fps), 0)

  return (
    <div
      style={{
        color: '#000',
        height: '150px',
        width: '150px',
        fontSize: '90px',
        fontWeight: 'bold',
        textAlign: 'center',
        borderRadius: '50%',
        padding: '20px',
        background: '#fff',
      }}
    >
      {timeLeft > 0 && timeLeft}
    </div>
  )
}
