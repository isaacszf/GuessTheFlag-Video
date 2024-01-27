import { useEffect, useState } from 'react'

type Props = {
  seconds: number
}

export const Counter = ({ seconds }: Props) => {
  const [timeLeft, setTimeLeft] = useState(seconds)

  useEffect(() => {
    if (timeLeft === 0) return

    const intervalDecrease = setInterval(() => setTimeLeft(t => t - 1), 1000)
    return () => clearInterval(intervalDecrease)
  }, [timeLeft])

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
