import * as React from 'react'
import { Animated, Easing } from 'react-native'

// Applies transform to children. When isTransformed is true, transform
// from start -> end. When transition is false transform from end -> start.

const TransformInOut = ({
  children,
  isTransformed,
  startValue,
  endValue,
  transformProperties,
}) => {
  const { useRef, useEffect } = React
  const transformValue = useRef(
    new Animated.Value(isTransformed ? endValue : startValue),
  ).current

  useEffect(() => {
    Animated.timing(transformValue, {
      toValue: isTransformed ? startValue : endValue,
      duration: 300,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start()

    return () => transformValue.stopAnimation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTransformed])

  const transformStyles = transformProperties.map((property) => ({
    [property]: transformValue,
  }))

  return (
    <Animated.View
      style={{
        transform: transformStyles,
      }}
    >
      {children}
    </Animated.View>
  )
}

export default TransformInOut
