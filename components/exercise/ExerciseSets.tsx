import React from 'react'
import { View, StyleSheet, useWindowDimensions } from 'react-native'

import Text from '@/components/base/Text'
import tokens from '@/styles/tokens'

const styles = StyleSheet.create({
  workoutSetsContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  workoutSetSquare: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: tokens.fill.primary,
    borderRadius: 1,
  },
  activeSetSquare: {
    backgroundColor: tokens.highlight,
    opacity: 0.75,
  },
  repCount: {
    fontWeight: '600',
    color: tokens.text.primaryColor,
    opacity: 0.7,
  },
})

export const ExerciseSets = ({ numSets, completedSets, highlightActiveSet }) => {
  const maxSetsPerRow = 9
  const width = useWindowDimensions().width
  const contentWidth = width - 2 * tokens.space.base
  const boxWidths = 0.9 * contentWidth
  const boxMargins = 0.1 * contentWidth
  const boxWidth = boxWidths / maxSetsPerRow
  const boxMargin = boxMargins / (maxSetsPerRow - 1)

  // We display boxes that are filled with a rep value for completed sets
  // or empty for incomplete sets. In cases where we have more sets completed
  // than the workout called for, we want to show the extra boxes.
  const numSetsToDisplay = Math.max(numSets, completedSets.length)
  let hasFirstIncompleteSet = false

  return (
    <View style={styles.workoutSetsContainer}>
      {[...Array(numSetsToDisplay)].map((_, i) => {
        const isSetComplete = Boolean(completedSets[i])
        const repsForSet = isSetComplete ? completedSets[i].reps : undefined

        let isActiveSet = false
        if (!isSetComplete && !hasFirstIncompleteSet) {
          isActiveSet = true
          hasFirstIncompleteSet = true
        }

        let workoutSquareStyle = styles.workoutSetSquare
        if (highlightActiveSet && isActiveSet) {
          workoutSquareStyle = { ...workoutSquareStyle, ...styles.activeSetSquare }
        }

        const dynamicStyle = {
          width: boxWidth,
          height: boxWidth,
          // No margin on every 9th set box
          marginRight: (i + 1) % maxSetsPerRow === 0 ? 0 : boxMargin,
          // top margin after first row of boxes
          marginTop: i >= maxSetsPerRow ? boxMargin : 0,
        }

        return (
          <View
            key={`set-${i}-reps-${repsForSet}`}
            style={[workoutSquareStyle, dynamicStyle]}
          >
            {isSetComplete ? (
              <Text style={styles.repCount}>{repsForSet}</Text>
            ) : null}
          </View>
        )
      })}
    </View>
  )
}

export default ExerciseSets
