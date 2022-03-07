import { useState } from 'react'

const useGesture = () => {
  const [gesture, setGesture] = useState(undefined)

  return {
    onGestureMove({ nativeEvent }) {
      const { pageX, pageY } = nativeEvent
      const currentGesture = { ...gesture }

      if (!currentGesture.startX) {
        currentGesture.startX = pageX
      }
      if (!currentGesture.startY) {
        currentGesture.startY = pageY
      }
      currentGesture.x = pageX
      currentGesture.y = pageY
      setGesture(currentGesture)
    },
    onGestureEnd() {
      setGesture(undefined)
    },
    gesture,
  }
}

export default useGesture
