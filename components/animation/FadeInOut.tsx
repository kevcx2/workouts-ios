import * as React from 'react'
import { Animated, Easing } from 'react-native'

// Fades element in and out. Removes children when fully faded out.

const FadeInOut = ({
  children,
  isVisible,
  onFadeOut,
  endValue,
  renderWhileHidden,
  style,
}) => {
  const { useRef, useEffect, useState } = React
  const [isShowingChildren, setIsShowingChildren] = useState(
    isVisible ? true : false,
  )
  const fadeValue = useRef(new Animated.Value(isVisible ? 1 : 0)).current

  useEffect(() => {
    if (isVisible) {
      setIsShowingChildren(true)
    }

    Animated.timing(fadeValue, {
      toValue: isVisible ? 1 : endValue || 0,
      duration: 275,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start(() => {
      if (!isVisible) {
        setIsShowingChildren(false)
        onFadeOut && onFadeOut()
      }
    })

    return () => fadeValue.stopAnimation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible])

  return (
    <Animated.View
      style={[
        {
          opacity: fadeValue,
        },
        style,
      ]}
    >
      {(isShowingChildren || renderWhileHidden) && children}
    </Animated.View>
  )
}

export default FadeInOut
