import React, { useState } from 'react'
import { View, Text, StyleSheet, Button } from 'react-native'

import { useWorkoutsContext } from '@/store/workouts'
import { useStopwatchContext } from '@/store/stopwatch'
import useGesture from '@/components/gesture/useGesture'
import PreviousExercisePeek from '@/components/set/PreviousExercisePeek'
import ExerciseSets from '@/components/exercise/ExerciseSets'
import RepCounter from '@/components/exercise/RepCounter'
import ElapsedTime from '@/components/ElapsedTime'
import tokens from '@/styles/tokens'
import ExerciseEditor from '@/components/editors/ExerciseEditor'
import formatExerciseDescription from '@/components/exercise/formatExerciseDescription'

const styles = StyleSheet.create({
  body: {
    display: 'flex',
    height: '100%',
    marginLeft: tokens.space.base,
    marginRight: tokens.space.base,
  },
  subheader: {
    fontSize: 24,
    fontWeight: '400',
    color: tokens.text.primaryColor,
    marginBottom: tokens.space.half,
  },
  previousExercise: {
    marginTop: tokens.space.base,
  },
  repCountContainer: {
    flex: 1,
  },
  bottomButtonArea: {
    display: 'flex',
    flex: 1,
    maxHeight: 135,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: tokens.space.base,
    marginHorizontal: 40,
  },
  undoButton: {
    color: tokens.text.dangerColor,
  },
})

const Set = ({ exercise }) => {
  const { addCompletedSetToExercise, undoLastCompletedSetForExercise } =
    useWorkoutsContext()
  const { reset, start } = useStopwatchContext()
  const { onGestureMove, onGestureEnd, gesture } = useGesture()
  const [numReps, setNumReps] = useState()

  exercise.history.sort(
    (exerciseA, exerciseB) =>
      new Date(exerciseB.completedAt) - new Date(exerciseA.completedAt),
  )
  const previousExercise = exercise.history[0]

  const exerciseDescription = formatExerciseDescription(
    exercise.weight,
    exercise.repsLow,
    exercise.repsHigh,
  )

  return (
    <View
      style={styles.body}
      onStartShouldSetResponder={() => true}
      onResponderMove={(event) => {
        onGestureMove(event)
      }}
      onResponderRelease={() => {
        onGestureEnd()
      }}
    >
      <Text style={styles.subheader}>{exerciseDescription}</Text>
      <ExerciseSets
        numSets={exercise.numSets}
        completedSets={exercise.completedSets}
        highlightActiveSet
      />
      {previousExercise && (
        <PreviousExercisePeek
          style={styles.previousExercise}
          gesture={gesture}
          previousExercise={previousExercise}
        />
      )}
      <View style={styles.repCountContainer}>
        <RepCounter
          gesture={gesture}
          numReps={numReps}
          repsLow={exercise.repsLow}
          repsHigh={exercise.repsHigh}
          onChange={setNumReps}
        />
      </View>
      <ElapsedTime />
      <View style={styles.bottomButtonArea}>
        <Button
          color={tokens.text.primaryColor}
          title={'Undo'}
          onPress={() => {
            undoLastCompletedSetForExercise(exercise.id)
          }}
          disabled={!exercise.completedSets.length}
        />
        <Button
          title={'Done'}
          onPress={() => {
            addCompletedSetToExercise(exercise.id, numReps)
            reset()
            start()
          }}
        />
      </View>
      <ExerciseEditor exercise={exercise} />
    </View>
  )
}

export default Set
