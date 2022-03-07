import * as React from 'react'
import { Animated, Easing } from 'react-native'

const ShrinkInOut = ({ children, isVisible, height }) => {
  const { useRef, useEffect } = React
  const heightValue = useRef(new Animated.Value(isVisible ? height : 0)).current

  useEffect(() => {
    Animated.timing(heightValue, {
      toValue: isVisible ? height : 0,
      duration: 300,
      easing: Easing.out(Easing.exp),
      useNativeDriver: false,
    }).start()

    return () => heightValue.stopAnimation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible])

  return <Animated.View style={{ height: heightValue }}>{children}</Animated.View>
}

export default ShrinkInOut
