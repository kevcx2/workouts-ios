import * as React from 'react'
import { View, StyleSheet, Button, Alert, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import PressableView from '@/components/base/PressableView'
import ScrollWithHeaderView from '@/components/ScrollWithHeaderView'
import BackButton from '@/components/base/BackButton'
import ActionsMenu from '@/components/ActionsMenu'
import Exercise from '@/components/exercise/Exercise'
import { useWorkoutsContext } from '@/store/workouts'

import tokens from '@/styles/tokens'

const styles = StyleSheet.create({
  exercise: {
    borderTopWidth: tokens.border.thinWidth,
    borderTopColor: tokens.border.separatorColor,
  },
  exerciseContainer: {
    marginLeft: tokens.space.base,
    marginRight: tokens.space.base,
    paddingTop: tokens.space.base,
    paddingBottom: tokens.space.base,
  },
  finishButton: {
    marginVertical: tokens.space.double,
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
  createFirstIcons: {
    fled: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  createFirstText: {
    color: tokens.text.secondaryColor,
    fontSize: tokens.text.size.base,
    width: '80%',
  },
})

function Workout({ route, navigation }) {
  const { workoutId, backName } = route.params
  const { getWorkoutById, completeWorkout, restoreLastWorkout } =
    useWorkoutsContext()
  const workout = getWorkoutById(workoutId)
  const { exercises } = workout
  const activeExercises = exercises.filter((exercise) => !exercise.deleted)
  const hasNoExercises = activeExercises.length === 0

  const onEditWorkout = () => {
    navigation.navigate('EditWorkout', { workoutId })
  }

  const headerActions = [
    {
      title: 'Edit workout',
      action: onEditWorkout,
      icon: 'create-outline',
    },
    {
      title: 'Workout history',
      action: () => {
        navigation.navigate('WorkoutHistory', { workoutId })
      },
      icon: 'analytics-outline',
    },
  ]

  // Can reopen the last workout if the current one
  // has not recorded any reps and there is at least one
  // exercise with a previous record.
  const isStartingNewWorkout = activeExercises.every(
    (exercise) => exercise.completedSets.length === 0,
  )
  const hasPriorWorkout = activeExercises.some(
    (exercise) => exercise.history.length > 0,
  )
  if (isStartingNewWorkout && hasPriorWorkout) {
    headerActions.push({
      title: 'Open last workout',
      action: () => restoreLastWorkout(workoutId),
      icon: 'arrow-undo-outline',
    })
  }

  return (
    <ScrollWithHeaderView
      header={workout.name}
      leftHeaderEl={<BackButton title={backName} />}
      rightHeaderEl={<ActionsMenu menuItems={headerActions} />}
    >
      <View>
        {activeExercises.map((exercise) => (
          <View style={styles.exercise} key={exercise.id}>
            <Exercise
              style={styles.exerciseContainer}
              key={exercise.name}
              onPress={() => {
                navigation.navigate('ExerciseSet', { exerciseId: exercise.id })
              }}
              exercise={exercise}
            />
          </View>
        ))}
        {hasNoExercises ? (
          <View style={styles.emptyGuideArea}>
            <PressableView style={styles.createFirst} onPress={onEditWorkout}>
              <Text style={styles.createFirstText}>
                Edit this workout to add exercises
              </Text>
              <View style={styles.createFirstIcons}>
                <Ionicons
                  name="ellipsis-horizontal-circle"
                  size={24}
                  color={tokens.text.secondaryColor}
                />
                <Ionicons
                  name="chevron-forward-outline"
                  size={24}
                  color={tokens.text.secondaryColor}
                />
                <Ionicons
                  name="create-outline"
                  size={24}
                  color={tokens.text.secondaryColor}
                />
              </View>
            </PressableView>
          </View>
        ) : (
          <View style={styles.finishButton}>
            <Button
              title="Done"
              onPress={() => {
                Alert.alert('End Workout', 'Your current workout will be saved', [
                  {
                    text: 'No',
                    style: 'cancel',
                  },
                  {
                    text: 'Yes',
                    onPress: () => {
                      completeWorkout(workoutId)
                      navigation.navigate('Workouts')
                    },
                  },
                ])
              }}
            />
          </View>
        )}
      </View>
    </ScrollWithHeaderView>
  )
}

export default Workout
