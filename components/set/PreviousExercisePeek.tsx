import React from 'react'
import { Animated, StyleSheet } from 'react-native'

import useTopDrawer from '@/components/animation/useTopDrawer'
import Exercise from '@/components/exercise/Exercise'

const styles = StyleSheet.create({
  previousExercise: {
    overflow: 'hidden',
  },
})

const PreviousExercisePeek = ({ gesture, previousExercise, style }) => {
  const { percentOpen: topDrawerPercentOpen } = useTopDrawer(gesture)

  const animatedStyle = {
    maxHeight: topDrawerPercentOpen.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 165],
      extrapolate: 'clamp',
    }),
    opacity: topDrawerPercentOpen.interpolate({
      inputRange: [0, 0.3, 1],
      outputRange: [0, 0.7, 1],
      extrapolate: 'clamp',
    }),
  }

  return (
    <Animated.View style={[style, styles.previousExercise, animatedStyle]}>
      <Exercise title={'Last time'} exercise={previousExercise} />
    </Animated.View>
  )
}

export default PreviousExercisePeek
