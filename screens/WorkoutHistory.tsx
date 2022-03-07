import React, { useState } from 'react'
import { View, Button, StyleSheet, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import ScrollWithHeaderView from '@/components/ScrollWithHeaderView'
import BackButton from '@/components/base/BackButton'
import { useWorkoutsContext } from '@/store/workouts'
import Strong from '@/components/base/Strong'
import ExerciseChart from '@/components/analytics/ExerciseChart'
import Exercise from '@/components/exercise/Exercise'
import PressableView from '@/components/base/PressableView'
import tokens from '@/styles/tokens'

const styles = StyleSheet.create({
  workoutHistory: {
    marginBottom: tokens.space.double,
  },
  exerciseHistory: {
    width: '100%',
    borderTopWidth: tokens.border.thinWidth,
    borderTopColor: tokens.border.separatorColor,
  },
  exerciseLabel: {
    margin: tokens.space.base,
    fontSize: tokens.text.size.lg,
  },
  exerciseContainer: {
    marginLeft: tokens.space.base,
    marginRight: tokens.space.base,
    paddingTop: tokens.space.base,
    paddingBottom: tokens.space.half,
  },
  noData: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: tokens.space.base,
    marginHorizontal: tokens.space.base,
    marginBottom: tokens.space.base,
    borderRadius: 12,
    backgroundColor: tokens.background.secondary,
  },
  noDataTextArea: {
    width: '84%',
    paddingRight: tokens.space.base,
  },
  noDataTitle: {
    color: tokens.text.secondaryColor,
    paddingBottom: tokens.space.half,
    fontSize: tokens.space.base,
    fontWeight: '600',
  },
  noDataDescription: {
    color: tokens.text.secondaryColor,
    fontSize: 14,
  },
  exercisePagination: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: tokens.space.base,
    marginTop: 0,
  },
  exerciseTitle: {
    fontWeight: '400',
  },
  exerciseChartPressed: {
    backgroundColor: 'transparent',
  },
})

const WorkoutHistory = ({ route }) => {
  const { workoutId } = route.params
  const { getWorkoutById } = useWorkoutsContext()
  const workout = getWorkoutById(workoutId)
  const { exercises } = workout
  const activeExercises = exercises.filter((exercise) => !exercise.deleted)

  return (
    <ScrollWithHeaderView header={workout.name} leftHeaderEl={<BackButton />}>
      <View style={styles.workoutHistory}>
        {activeExercises.map((exercise) => (
          <ExerciseHistory exercise={exercise} key={exercise.id} />
        ))}
      </View>
    </ScrollWithHeaderView>
  )
}

export default WorkoutHistory

const ExerciseHistory = ({ exercise }) => {
  const [chartType, setChartType] = useState('weight')
  const [position, setPosition] = useState(0)

  const showOlder = () => {
    setPosition(position + 1)
  }

  const showNewer = () => {
    setPosition(position - 1)
  }

  // Get three most recent completed exercise details
  exercise.history.sort(
    (exerciseA, exerciseB) =>
      new Date(exerciseB.completedAt) - new Date(exerciseA.completedAt),
  )

  const recentExercises = exercise.history.slice(position, position + 2)
  recentExercises.forEach((recentExercise) => {
    let date = new Date(recentExercise.completedAt)
    recentExercise.displayDate = `${date.getMonth() + 1}/${date.getDate()}`
  })
  const hasNoHistory = recentExercises.length === 0

  return (
    <View style={styles.exerciseHistory}>
      <Strong style={styles.exerciseLabel}>{exercise.name}</Strong>
      {hasNoHistory && (
        <View style={styles.noData}>
          <View style={styles.noDataTextArea}>
            <Text style={styles.noDataTitle}>No workout history</Text>
            <Text style={styles.noDataDescription}>
              As you complete workouts, you can track your progress here
            </Text>
          </View>
          <View>
            <Ionicons
              name="analytics-outline"
              size={42}
              color={tokens.text.secondaryColor}
            />
          </View>
        </View>
      )}
      {!hasNoHistory && (
        <>
          <PressableView
            style={{
              marginHorizontal: tokens.space.base,
            }}
            pressedStyle={styles.exerciseChartPressed}
            onPress={() => {
              if (chartType === 'weight') {
                setChartType('totalLifted')
              } else {
                setChartType('weight')
              }
            }}
          >
            <ExerciseChart exercise={exercise} chartType={chartType} />
          </PressableView>
          <Exercise
            style={styles.exerciseContainer}
            title={'Today'}
            titleStyle={styles.exerciseTitle}
            exercise={exercise}
          />
          {recentExercises.map((recentExercise) => (
            <Exercise
              key={`${recentExercise.name}${recentExercise.completedAt}`}
              style={styles.exerciseContainer}
              title={recentExercise.displayDate}
              titleStyle={styles.exerciseTitle}
              exercise={recentExercise}
            />
          ))}
          <View style={styles.exercisePagination}>
            <View>
              {position < exercise.history.length - 2 && ( // If there are older workouts, show the "Older" button.
                <Button title="Older" onPress={showOlder} />
              )}
            </View>
            <View>
              {position > 0 && ( // If there are newer workouts, show the "Newer" button.
                <Button title="Newer" onPress={showNewer} />
              )}
            </View>
          </View>
        </>
      )}
    </View>
  )
}
