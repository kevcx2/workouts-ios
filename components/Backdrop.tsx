import React, { useState, useEffect, useRef } from 'react'
import { View, StyleSheet } from 'react-native'
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated'
import constate from 'constate'

import { useStopwatchContext } from '@/store/stopwatch'
import tokens from '@/styles/tokens'

const BACKDROP_ANIMATION_DURATION = 400
const BACKDROP_SCALE = 0.92
const BACKDROP_OPACITY = 0.75
const BACKDROP_TRANSLATE_Y = 10

// Controls the global backdrop visibility state
const useBackdrop = () => {
  const { stop, toggle, isRunning: timerIsRunning } = useStopwatchContext()
  const [shouldTimerRunWhenClosed, setShouldTimerRunWhenClosed] = useState(false)

  const scale = useSharedValue(1)
  const opacity = useSharedValue(0)
  const translateY = useSharedValue(0)

  const animateShowBackdrop = () => {
    scale.value = withTiming(BACKDROP_SCALE, {
      duration: BACKDROP_ANIMATION_DURATION,
    })
    opacity.value = withTiming(BACKDROP_OPACITY, {
      duration: BACKDROP_ANIMATION_DURATION,
    })
    translateY.value = withTiming(BACKDROP_TRANSLATE_Y, {
      duration: BACKDROP_ANIMATION_DURATION,
    })
  }

  const animateHideBackdrop = () => {
    scale.value = withTiming(1, { duration: BACKDROP_ANIMATION_DURATION })
    opacity.value = withTiming(0, { duration: BACKDROP_ANIMATION_DURATION })
    translateY.value = withTiming(0, { duration: BACKDROP_ANIMATION_DURATION })
  }

  // Pause the timer while the backdrop is animating in.
  // This reduces state changes during the animation and improves animation performance.
  const show = () => {
    if (timerIsRunning) {
      setShouldTimerRunWhenClosed(true)
      stop()
    }
    animateShowBackdrop()
  }

  // Resume the timer after the backdrop animates out.
  // This reduces state changes during the animation and improves animation performance.
  const hide = () => {
    if (shouldTimerRunWhenClosed) {
      setTimeout(() => {
        stop()
        toggle()
        setShouldTimerRunWhenClosed(false)
      }, BACKDROP_ANIMATION_DURATION)
    }
    animateHideBackdrop()
  }

  const setPercentageVisible = (percentageVisible) => {
    if (percentageVisible > 1) percentageVisible = 1
    if (percentageVisible < 0) percentageVisible = 0
    scale.value = withTiming(1 - (1 - BACKDROP_SCALE) * percentageVisible, {
      duration: 75,
    })
    opacity.value = withTiming(BACKDROP_OPACITY * percentageVisible, {
      duration: 75,
    })
    translateY.value = withTiming(BACKDROP_TRANSLATE_Y * percentageVisible, {
      duration: 75,
    })
  }

  return {
    show,
    hide,
    scale,
    opacity,
    translateY,
    setPercentageVisible,
  }
}
export const [BackdropProvider, useBackdropContext] = constate(useBackdrop)

const styles = StyleSheet.create({
  backdropBackground: {
    backgroundColor: tokens.background.primary,
  },
  backdropContent: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  backdropOverlay: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: tokens.background.secondary,
    borderRadius: 12,
    zIndex: 100,
  },
})

// Renders the backdrop and backdrop animation, displayed under
// the 'bottom sheet' modal, mimicking iOS native look and feel.
const Backdrop = ({ children }) => {
  const { scale, opacity, translateY } = useBackdropContext()

  return (
    <View style={styles.backdropBackground}>
      <Animated.View
        style={[
          styles.backdropContent,
          { transform: [{ scale: scale }, { translateY: translateY }] },
        ]}
      >
        <Animated.View
          pointerEvents="none"
          style={[styles.backdropOverlay, { opacity: opacity }]}
        />
        {children}
      </Animated.View>
    </View>
  )
}

export default Backdrop
