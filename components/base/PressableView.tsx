import React, { useState } from 'react'
import { Pressable } from 'react-native'

import tokens from '@/styles/tokens'

const PressableView = ({ onPress, children, style, pressedStyle }) => {
  const [isPressed, setIsPressed] = useState(false)

  pressedStyle = {
    backgroundColor: tokens.fill.primary,
    ...pressedStyle,
  }

  const appliedStyle = isPressed
    ? {
        ...style,
        ...pressedStyle,
      }
    : style

  return (
    <Pressable
      style={appliedStyle}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={onPress}
    >
      {children}
    </Pressable>
  )
}

export default PressableView
