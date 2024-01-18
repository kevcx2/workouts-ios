import React, { useState, useEffect } from 'react'
import { Text, TextInput, View, StyleSheet, Button } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import BottomSheet from '@/components/base/BottomSheet'
import Strong from '@/components/base/Strong'
import ExerciseDetailPickers from '@/components/editors/ExerciseDetailPickers'
import { useWorkoutsContext } from '@/store/workouts'
import PressableView from '@/components/base/PressableView'
import tokens from '@/styles/tokens'

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: tokens.space.base,
    height: 35,
  },
  headerButtonLeft: {
    width: 75,
    marginLeft: 4,
  },
  headerButtonRight: {
    width: 75,
    textAlign: 'right',
  },
  contentArea: {
    marginHorizontal: tokens.space.base,
  },
  exerciseName: {
    display: 'flex',
    flexDirection: 'row',
    color: tokens.text.primaryColor,
    backgroundColor: tokens.background.tertiary,
    marginBottom: tokens.space.base,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  nameInput: {
    flex: 1,
    marginLeft: tokens.space.base,
  },
  nameLabelText: {
    color: tokens.text.primaryColor,
    fontSize: tokens.text.size.base,
  },
  nameInputText: {
    color: tokens.text.secondaryColor,
    fontSize: tokens.text.size.base,
  },
  setsInputArea: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  setsInput: {
    width: 133,
    display: 'flex',
    flexDirection: 'row',
    color: tokens.text.primaryColor,
    backgroundColor: tokens.background.tertiary,
    marginBottom: tokens.space.base,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  setsInputText: {
    color: tokens.text.secondaryColor,
    fontSize: tokens.text.size.base,
    paddingLeft: 24,
  },
  setsAdjustment: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: tokens.background.tertiary,
    marginBottom: tokens.space.base,
    borderRadius: 12,
    paddingVertical: 7,
    paddingHorizontal: 9,
    marginLeft: 12,
  },
})

const MAX_SETS = 18

const ExerciseEditor = ({ exercise }) => {
  const [weightAndReps, setWeightAndReps] = useState({
    weight: exercise?.weight,
    repsLow: exercise?.repsLow,
    repsHigh: exercise?.repsHigh,
  })
  const [exerciseName, setExerciseName] = useState(exercise?.name)
  const [numSets, setNumSets] = useState(exercise?.numSets || 1)

  useEffect(() => {
    setExerciseName(exercise?.name)
    setWeightAndReps({
      weight: exercise?.weight,
      repsLow: exercise?.repsLow,
      repsHigh: exercise?.repsHigh,
    })
    setNumSets(exercise?.numSets || 1)
  }, [exercise])

  const {
    isEditingExercise,
    stopEditingExercise,
    updateExerciseWeightReps,
    updateExerciseName,
    updateExerciseNumSets,
  } = useWorkoutsContext()

  return (
    <BottomSheet
      isOpen={isEditingExercise}
      height={450}
      onClose={stopEditingExercise}
    >
      <View style={styles.header}>
        <View style={styles.headerButtonLeft}>
          <Button
            title={'Cancel'}
            onPress={() => {
              // Stop editing and reset editor to defaults
              stopEditingExercise()
              setWeightAndReps({
                weight: exercise.weight,
                repsLow: exercise.repsLow,
                repsHigh: exercise.repsHigh,
              })
              setExerciseName(exercise.name)
              setNumSets(exercise.numSets || 1)
            }}
          />
        </View>
        <Strong>Edit Exercise</Strong>
        <View style={styles.headerButtonRight}>
          <Button
            title={'Save'}
            onPress={() => {
              updateExerciseWeightReps(exercise.id, weightAndReps)
              updateExerciseName(exercise.id, exerciseName)
              updateExerciseNumSets(exercise.id, numSets)
              stopEditingExercise()
            }}
          />
        </View>
      </View>
      <View style={styles.contentArea}>
        <View style={styles.exerciseName}>
          <Text style={styles.nameLabelText}>Name</Text>
          <View style={styles.nameInput}>
            <TextInput
              style={styles.nameInputText}
              value={exerciseName}
              placeholder="Exercise Name"
              onChangeText={setExerciseName}
              clearButtonMode="while-editing"
              selectTextOnFocus
            />
          </View>
        </View>
        <View style={styles.setsInputArea}>
          <View style={styles.setsInput}>
            <Text style={styles.nameLabelText}>Sets</Text>
            <Text style={styles.setsInputText}>{numSets}</Text>
          </View>
          <PressableView
            style={styles.setsAdjustment}
            onPress={() => {
              const nextNumSets = numSets + 1
              setNumSets(Math.min(nextNumSets, MAX_SETS))
            }}
          >
            <Ionicons
              name="add-outline"
              size={24}
              color={tokens.text.secondaryColor}
            />
          </PressableView>
          <PressableView
            style={styles.setsAdjustment}
            onPress={() => {
              const nextNumSets = numSets - 1
              setNumSets(Math.max(nextNumSets, 1))
            }}
          >
            <Ionicons
              name="remove-outline"
              size={24}
              color={tokens.text.secondaryColor}
            />
          </PressableView>
        </View>
        <ExerciseDetailPickers
          weight={weightAndReps.weight}
          repsLow={weightAndReps.repsLow}
          repsHigh={weightAndReps.repsHigh}
          onChange={(updatedWeightReps) => {
            setWeightAndReps(updatedWeightReps)
          }}
        />
      </View>
    </BottomSheet>
  )
}

export default ExerciseEditor
