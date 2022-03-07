import React from 'react'
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native'
import * as Haptics from 'expo-haptics'

import tokens from '@/styles/tokens'

// Slop distance is a small area where the user can move their touch without
// it registering as a change.
const SWIPE_SLOP_DISTANCE = 8

const clampValue = (value, min, max) => {
  let clampedVal = value
  clampedVal = Math.max(value, min)
  clampedVal = Math.min(value, max)
  return clampedVal
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 112,
    color: tokens.text.primaryColor,
  },
})

// As the touch drags left and right, translate the gesture into
// a change value that will be applied to the current rep count.
// Once the gesture ends, apply the change using the onChange
// handler.
//
// To translate a gesture into a change value there are a few steps:
//
// 1. Determine the interval value (an interval of 20 means every 20
//    pixels of drag = +/-1 rep). This is dynamic depending on the exercise
//    rep range, and where the user first touched their finger down.
//
// 2. Determine how far the touch has moved since it started (swipe distance)
//
// 3. Divide the swipe distance by the interval to get the change in reps

const RepCounter = ({ gesture, numReps, repsLow, repsHigh, onChange }) => {
  const { useState } = React
  const screenWidth = useWindowDimensions().width
  const [repChange, setRepChange] = useState(0)

  const repCount =
    numReps === undefined ? Math.floor((repsLow + repsHigh) / 2) : numReps
  const repRange = Math.min(repsHigh - repsLow, 4)

  React.useEffect(() => {
    if (gesture) {
      let nextRepChange = 0

      if (gesture.startX > gesture.x) {
        // swipe to left
        const widthToLeftOfTouch = gesture.startX - SWIPE_SLOP_DISTANCE
        // Interval distance is the swipe distance required to register
        // a single rep addition / subtraction. It depends on the number
        /// of reps in the exercise and how much room we have until we hit
        // the edge of the screen. It is bounded with a min and max.
        const leftIntervalDistance = clampValue(
          widthToLeftOfTouch / (repRange * 1.5),
          20,
          50,
        )
        let swipeDistance = gesture.startX - SWIPE_SLOP_DISTANCE - gesture.x
        if (swipeDistance < 0) swipeDistance = 0
        nextRepChange = -Math.floor(swipeDistance / leftIntervalDistance)
      } else {
        // swipe to right
        const widthToRightOfTouch =
          screenWidth - (gesture.startX + SWIPE_SLOP_DISTANCE)
        const rightIntervalDistance = clampValue(
          widthToRightOfTouch / (repRange * 1.5),
          30,
          50,
        )
        let swipeDistance = gesture.x - (gesture.startX + SWIPE_SLOP_DISTANCE)
        if (swipeDistance < 0) swipeDistance = 0
        nextRepChange = Math.floor(swipeDistance / rightIntervalDistance)
      }

      if (repCount + nextRepChange >= 0 && repChange !== nextRepChange) {
        Haptics.selectionAsync()
        setRepChange(nextRepChange)
      }
    } else {
      onChange(repCount + repChange)
      setRepChange(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gesture])

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{repCount + repChange}</Text>
    </View>
  )
}

export default RepCounter
