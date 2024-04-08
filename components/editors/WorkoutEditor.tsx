import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  PlatformColor,
  Alert,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import Exercise from '@/components/exercise/Exercise'
import { useWorkoutsContext } from '@/store/workouts'
import PressableView from '@/components/base/PressableView'
import ExerciseEditor from '@/components/editors/ExerciseEditor'
import ExerciseEditButtons from '@/components/editors/ExerciseEditButtons'
import ArchivedExerciseButtons from '@/components/editors/ArchivedExerciseButtons'
import tokens from '@/styles/tokens'

const styles = StyleSheet.create({
  exercise: {
    borderTopWidth: tokens.border.thinWidth,
    borderTopColor: tokens.border.separatorColor,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exerciseContainer: {
    flex: 1,
    marginLeft: tokens.space.base,
    marginRight: tokens.space.base,
    paddingTop: tokens.space.base,
    paddingBottom: tokens.space.base,
  },
  workoutNameContainer: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: tokens.background.secondary,
    marginBottom: tokens.space.base,
    borderRadius: 12,
    paddingVertical: 10,
    paddingLeft: 15,
    paddingRight: 10,
    marginHorizontal: tokens.space.base,
  },
  workoutNameInput: {
    flex: 1,
    marginLeft: tokens.space.base,
  },
  workoutNameLabel: {
    color: tokens.text.primaryColor,
    fontSize: tokens.text.size.base,
  },
  workoutNameText: {
    color: tokens.text.secondaryColor,
    fontSize: tokens.text.size.base,
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
  },
  actionIcon: {
    padding: 10,
    paddingVertical: 24,
  },
  actionPressed: {
    backgroundColor: 'transparent',
    opacity: 0.4,
  },
  archivedHeader: {
    width: '100%',
    backgroundColor: tokens.background.secondary,
    paddingHorizontal: tokens.space.base,
    paddingVertical: tokens.space.half,
  },
  archivedHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: tokens.text.secondaryColor,
  },
  emptyGuideArea: {
    width: '100%',
    borderTopWidth: tokens.border.thinWidth,
    borderTopColor: tokens.border.separatorColor,
  },
  createFirst: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: tokens.background.secondary,
    padding: tokens.space.base,
    margin: tokens.space.base,
    borderRadius: 12,
  },
  createFirstText: {
    color: tokens.text.secondaryColor,
    fontSize: tokens.text.size.base,
    width: '80%',
  },
})

// TODO: Break this up into sub-components.
function WorkoutEditor({
  navigation,
  workoutId,
  selectedExercise,
  onSelectExercise,
  onAddExercise,
}) {
  const {
    getWorkoutById,
    moveExerciseUp,
    renameWorkout,
    editExercise,
    archiveExercise,
    restoreExercise,
    deleteExercise,
  } = useWorkoutsContext()
  const workout = getWorkoutById(workoutId)
  const { exercises } = workout
  const hasNoExercises = exercises.length === 0


  const activeExercises = exercises.filter((exercise) => !exercise.deleted)
  const archivedExercises = exercises.filter((exercise) => exercise.deleted)

  return (
    <>
      <View style={styles.workoutNameContainer}>
        <Text style={styles.workoutNameLabel}>Name</Text>
        <View style={styles.workoutNameInput}>
          <TextInput
            style={styles.workoutNameText}
            placeholder="Workout Name"
            clearButtonMode="while-editing"
            value={workout.name}
            onChangeText={(newName) => renameWorkout(workoutId, newName)}
          />
        </View>
      </View>
      {activeExercises.map((exercise) => (
        <PressableView
          style={styles.exercise}
          key={exercise.id}
          onPress={() => {
            onSelectExercise(exercise)
            editExercise()
          }}
        >
          <Exercise
            style={styles.exerciseContainer}
            key={exercise.name}
            exercise={exercise}
            hideSets
          />
          <ExerciseEditButtons
            onMoveExerciseUp={() => {
              moveExerciseUp(workoutId, exercise.id)
            }}
            onEditExercise={() => {
              onSelectExercise(exercise)
              editExercise()
            }}
            onArchiveExercise={() => {
              archiveExercise(exercise.id)
            }}
          />
        </PressableView>
      ))}
      {!!archivedExercises.length && (
        <>
          <View style={styles.archivedHeader}>
            <Text style={styles.archivedHeaderText}>{'REMOVED'}</Text>
          </View>
          {archivedExercises.map((exercise) => (
            <View style={styles.exercise} key={exercise.id}>
              <Exercise
                style={styles.exerciseContainer}
                key={exercise.name}
                exercise={exercise}
                hideSets
              />
              <ArchivedExerciseButtons
                onRestoreExercise={() => restoreExercise(exercise.id)}
                onDeleteExercise={() => deleteExercise(exercise.id)}
              />
            </View>
          ))}
        </>
      )}
      {hasNoExercises && (
        <View style={styles.emptyGuideArea}>
          <PressableView style={styles.createFirst} onPress={onAddExercise}>
            <Text style={styles.createFirstText}>
              Add an exercise to this workout
            </Text>
            <Ionicons
              name="add-circle-outline"
              size={24}
              color={tokens.text.secondaryColor}
            />
          </PressableView>
        </View>
      )}
      <ExerciseEditor exercise={selectedExercise} />
    </>
  )
}

export default WorkoutEditor
