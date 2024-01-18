import React, { useState } from 'react'
import { View, StyleSheet, PlatformColor, Button, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import ScrollWithHeaderView from '@/components/ScrollWithHeaderView'
import BackButton from '@/components/base/BackButton'
import { useWorkoutsContext } from '@/store/workouts'
import PressableView from '@/components/base/PressableView'
import WorkoutEditor from '@/components/editors/WorkoutEditor'
import tokens from '@/styles/tokens'

const styles = StyleSheet.create({
  actionPressed: {
    backgroundColor: 'transparent',
    opacity: 0.4,
  },
  deleteButton: {
    marginVertical: tokens.space.double,
  },
})

function EditWorkout({ navigation, route }) {
  const { workoutId, backName } = route.params
  const { getWorkoutById, createExercise, editExercise, deleteWorkout } =
    useWorkoutsContext()
  const workout = getWorkoutById(workoutId)
  const { exercises } = workout
  const [selectedExercise, setSelectedExercise] = useState(exercises[0])

  const onAddExercise = () => {
    const createdExercise = createExercise(workoutId)
    setSelectedExercise(createdExercise)
    editExercise()
  }

  const isEmptyWorkout = workout.name === '' && exercises.length === 0

  return (
    <ScrollWithHeaderView
      leftHeaderEl={
        <BackButton
          title={backName}
          onBack={() => {
            if (isEmptyWorkout) {
              deleteWorkout(workoutId)
            }
          }}
        />
      }
      rightHeaderEl={<AddExerciseButton onAddExercise={onAddExercise} />}
      header="Edit Workout"
      showSmallHeaderOnScroll
    >
      <WorkoutEditor
        workoutId={workoutId}
        selectedExercise={selectedExercise}
        onSelectExercise={setSelectedExercise}
        onAddExercise={onAddExercise}
      />
      <View style={styles.deleteButton}>
        <Button
          title="Delete"
          color={PlatformColor('systemRed')}
          onPress={() => {
            Alert.alert(
              'Delete Workout',
              'This will permanently delete this workout and all related workout data',
              [
                {
                  text: 'No',
                  style: 'cancel',
                },
                {
                  text: 'Yes',
                  onPress: () => {
                    navigation.navigate('Workouts')
                    deleteWorkout(workoutId)
                  },
                },
              ],
            )
          }}
        />
      </View>
    </ScrollWithHeaderView>
  )
}

export const AddExerciseButton = ({ onAddExercise }) => {
  return (
    <PressableView pressedStyle={styles.actionPressed} onPress={onAddExercise}>
      <Ionicons name="add-circle-outline" size={28} color={PlatformColor('link')} />
    </PressableView>
  )
}

export default EditWorkout
