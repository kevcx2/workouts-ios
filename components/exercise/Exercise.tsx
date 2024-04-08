import React from 'react'
import { View, StyleSheet } from 'react-native'

import Text from '@/components/base/Text'
import Strong from '@/components/base/Strong'
import PressableView from '@/components/base/PressableView'
import ExerciseSets from '@/components/exercise/ExerciseSets'
import tokens from '@/styles/tokens'
import formatExerciseDescription from '@/components/exercise/formatExerciseDescription'

const styles = StyleSheet.create({
  name: {
    color: tokens.text.primaryColor,
  },
  details: {
    marginTop: tokens.space.small,
    color: tokens.text.secondaryColor,
  },
  titleRowContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  supersetContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.space.small,
    paddingHorizontal: tokens.space.half,
    backgroundColor: tokens.background.secondary,
    borderRadius: tokens.space.double,
  },
  supersetBadgeText: {
    color: tokens.text.secondaryColor,
    fontSize: tokens.text.size.sm,
  },
})

const Exercise = ({
  exercise,
  onPress,
  title,
  style,
  titleStyle,
  hideSets,
}) => {
  const content = (
    <View style={style}>
      <View style={styles.titleRowContainer}>
        <Strong style={[styles.name, titleStyle]}>
          {title ? title : exercise.name}
        </Strong>
      </View>
      <Text style={styles.details}>
        {formatExerciseDescription(
          exercise.weight,
          exercise.repsLow,
          exercise.repsHigh,
        )}
      </Text>
      {!hideSets && (
        <ExerciseSets
          numSets={exercise.numSets}
          completedSets={exercise.completedSets}
        />
      )}
    </View>
  )

  if (onPress) {
    return <PressableView onPress={onPress}>{content}</PressableView>
  } else {
    return content
  }
}

export default Exercise
