import { useState, useEffect } from 'react'
import constate from 'constate'
// import { workouts as seed } from "./seedData"
import createId from './createId'
import persistence from './persistence'

const WORKOUTS_STORE_KEY = '@workouts'

// TODO: Enforce immutability of the state object.
const useWorkouts = () => {
  const [workouts, setWorkouts] = useState([])
  const [isEditingExercise, setIsEditingExercise] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      let savedState = await persistence.load(WORKOUTS_STORE_KEY)
      if (savedState) setWorkouts(savedState)
      // For easy seeding during development, uncomment this and the import above.
      // saveWorkoutsState(seed)
      setIsLoading(false)
    }
    load()
  }, [])

  const getWorkoutById = (workoutId, workoutsState = workouts) => {
    return workoutsState.find((workout) => workout.id === workoutId)
  }

  const getWorkoutByExerciseId = (exerciseId, workoutsState = workouts) => {
    return workoutsState.find((workout) => {
      return workout.exercises.find((exercise) => exercise.id === exerciseId)
    })
  }

  const saveWorkoutsState = async (newState) => {
    setWorkouts(newState)
    persistence.save(WORKOUTS_STORE_KEY, newState)
  }

  const getExerciseById = (exerciseId, workoutsState = workouts) => {
    for (const workout of workoutsState) {
      const selectedExercise = workout.exercises.find(
        (exercise) => exercise.id === exerciseId,
      )
      if (selectedExercise) {
        return selectedExercise
      }
    }
    return null // Exercise not found
  }

  const addCompletedSetToExercise = (exerciseId, reps) => {
    const updatedWorkouts = [...workouts]
    const exerciseToUpdate = getExerciseById(exerciseId, updatedWorkouts)
    exerciseToUpdate.completedSets.push({ reps })
    saveWorkoutsState(updatedWorkouts)
  }

  const undoLastCompletedSetForExercise = (exerciseId) => {
    const updatedWorkouts = [...workouts]
    const exerciseToUpdate = getExerciseById(exerciseId, updatedWorkouts)
    exerciseToUpdate.completedSets.pop()
    saveWorkoutsState(updatedWorkouts)
  }

  const updateExerciseWeightReps = (exerciseId, updatedExerciseDetails) => {
    const { weight, repsLow, repsHigh } = updatedExerciseDetails
    const updatedWorkouts = [...workouts]
    const exerciseToUpdate = getExerciseById(exerciseId, updatedWorkouts)
    exerciseToUpdate.weight = weight
    exerciseToUpdate.repsLow = repsLow
    exerciseToUpdate.repsHigh = repsHigh
    saveWorkoutsState(updatedWorkouts)
  }

  const updateExerciseName = (exerciseId, updatedName) => {
    const updatedWorkouts = [...workouts]
    const exerciseToUpdate = getExerciseById(exerciseId, updatedWorkouts)
    exerciseToUpdate.name = updatedName || 'New Exercise'
    saveWorkoutsState(updatedWorkouts)
  }

  const updateExerciseNumSets = (exerciseId, updatedNumSets) => {
    const updatedWorkouts = [...workouts]
    const exerciseToUpdate = getExerciseById(exerciseId, updatedWorkouts)
    exerciseToUpdate.numSets = updatedNumSets
    saveWorkoutsState(updatedWorkouts)
  }

  const completeWorkout = (workoutId) => {
    const updatedWorkouts = [...workouts]
    const workoutToComplete = getWorkoutById(workoutId, updatedWorkouts)
    // update last completed date
    workoutToComplete.lastCompletedAt = new Date().toString()
    // move each exercise to history
    workoutToComplete.exercises.forEach((exercise) => {
      const exerciseToArchive = { ...exercise }
      delete exerciseToArchive.history
      exerciseToArchive.completedAt = new Date().toString()
      exercise.history.push(exerciseToArchive)
      // reset current exercise to blank state
      exercise.completedSets = []
      const newId = createId()
      // Because exercise ids are being re-created, we need to update the exercise ids
      // used to track superset exercises 
      updateSupersetExerciseId(
        workoutToComplete.supersets,
        exercise.id,
        newId,
      )
      exercise.id = newId
    })
    saveWorkoutsState(updatedWorkouts)
  }

  // Update the exercise id in a superset. Updates exercise id
  // when it is a key or value.
  const updateSupersetExerciseId = (supersets, oldId, newId) => {
    // Check every value and update if the value === oldId
    for (const key in supersets) {
      if (supersets[key] === oldId) {
        supersets[key] = newId
      }
    }
    if (supersets[oldId]) {
      supersets[newId] = supersets[oldId]
      delete supersets[oldId]
    }
    return supersets
  }

  const restoreLastWorkout = (workoutId) => {
    const updatedWorkouts = workouts.map((workout) => {
      if (workout.id === workoutId) {
        return {
          ...workout,
          exercises: workout.exercises.map((exercise) => {
            if (exercise.history.length > 0) {
              exercise.history.sort(
                (exerciseA, exerciseB) =>
                  new Date(exerciseB.completedAt) - new Date(exerciseA.completedAt),
              )
              const priorExercise = exercise.history[0]
              exercise.history = exercise.history.slice(1)

              return {
                ...exercise,
                ...priorExercise,
              }
            }
            return exercise
          }),
        }
      }
      return workout
    })

    saveWorkoutsState(updatedWorkouts)
  }

  const moveExerciseUp = (workoutId, exerciseId) => {
    let updatedWorkouts = [...workouts]
    updatedWorkouts = moveExercise(updatedWorkouts, workoutId, exerciseId, 'back')
    saveWorkoutsState(updatedWorkouts)
  }

  // eslint-disable-next-line no-shadow
  const moveExercise = (workouts, workoutId, exerciseId, direction) => {
    // Find the index of the workout to modify
    const workoutIndex = workouts.findIndex((workout) => workout.id === workoutId)
    // Find the index of the exercise to move
    const exerciseIndex = workouts[workoutIndex].exercises.findIndex(
      (exercise) => exercise.id === exerciseId,
    )
    // Detect if the exercise can move; if the direction is back, the exercise cannot
    // move past the 0 index; if the direction is forward, the exercise cannot move
    // past the last index
    if (
      (direction === 'back' && exerciseIndex === 0) ||
      (direction === 'forward' &&
        exerciseIndex === workouts[workoutIndex].exercises.length - 1)
    ) {
      return workouts
    }
    // If the exercise can move, position the array elements in their new locations
    workouts[workoutIndex].exercises.splice(
      direction === 'back' ? exerciseIndex - 1 : exerciseIndex + 1,
      0,
      workouts[workoutIndex].exercises.splice(exerciseIndex, 1)[0],
    )

    return workouts
  }

  const renameWorkout = (workoutId, newName) => {
    const updatedWorkouts = [...workouts]
    const workoutToUpdate = getWorkoutById(workoutId, updatedWorkouts)
    workoutToUpdate.name = newName
    saveWorkoutsState(updatedWorkouts)
  }

  const archiveExercise = (exerciseId) => {
    const updatedWorkouts = [...workouts]
    const exerciseToUpdate = getExerciseById(exerciseId, updatedWorkouts)
    exerciseToUpdate.deleted = true
    saveWorkoutsState(updatedWorkouts)
  }

  const restoreExercise = (exerciseId) => {
    const updatedWorkouts = [...workouts]
    const exerciseToUpdate = getExerciseById(exerciseId, updatedWorkouts)
    delete exerciseToUpdate.deleted
    saveWorkoutsState(updatedWorkouts)
  }

  const deleteExercise = (exerciseId) => {
    let updatedWorkouts = [...workouts]
    updatedWorkouts = updatedWorkouts.map((workout) => {
      return {
        ...workout,
        exercises: workout.exercises.filter(
          (exercise) => exercise.id !== exerciseId,
        ),
      }
    })
    saveWorkoutsState(updatedWorkouts)
  }

  const createExercise = (workoutId) => {
    const updatedWorkouts = [...workouts]
    const workoutToUpdate = getWorkoutById(workoutId, updatedWorkouts)
    const newExercise = {
      id: createId(),
      name: 'New exercise',
      weight: 20,
      repsLow: 5,
      repsHigh: 10,
      numSets: 3,
      completedSets: [],
      history: [],
    }
    workoutToUpdate.exercises.push(newExercise)
    saveWorkoutsState(updatedWorkouts)
    return newExercise
  }

  const createWorkout = () => {
    const updatedWorkouts = [...workouts]
    const newWorkout = {
      id: createId(),
      name: '',
      lastCompletedAt: undefined,
      exercises: [],
    }
    updatedWorkouts.push(newWorkout)
    saveWorkoutsState(updatedWorkouts)
    return newWorkout
  }

  const deleteWorkout = (workoutId) => {
    const updatedWorkouts = [...workouts]
    saveWorkoutsState(updatedWorkouts.filter((workout) => workout.id !== workoutId))
  }

  

  // Create a superset between two exercises. A superset is structured as:
  // supersets: {
  //   [firstSupersetExerciseId]: secondSupersetExerciseId,
  //   [secondSupersetExerciseId]: firstSupersetExerciseId,
  // }
  const createSuperset = (
    workoutId,
    supersetFirstExerciseId,
    supersetSecondExerciseId,
  ) => {
    const updatedWorkouts = [...workouts]
    let workoutToUpdate = getWorkoutById(workoutId, updatedWorkouts)
    if (!workoutToUpdate.supersets) {
      workoutToUpdate.supersets = {}
    }
    workoutToUpdate.supersets[supersetFirstExerciseId] = supersetSecondExerciseId
    workoutToUpdate.supersets[supersetSecondExerciseId] = supersetFirstExerciseId
    workoutToUpdate = reorderExercisesToBeNextToEachOther(
      workoutToUpdate,
      supersetFirstExerciseId,
      supersetSecondExerciseId,
    )
    saveWorkoutsState(updatedWorkouts)
  }

  // Reorder the exercises in a workout so that the two exercises are next to each other.
  // Used when creating a superset
  const reorderExercisesToBeNextToEachOther = (
    workoutToUpdate,
    firstExerciseId,
    secondExerciseId,
  ) => {
    const firstExerciseIndex = workoutToUpdate.exercises.findIndex(
      (exercise) => exercise.id === firstExerciseId,
    )
    const secondExerciseIndex = workoutToUpdate.exercises.findIndex(
      (exercise) => exercise.id === secondExerciseId,
    )
    const [secondExercise] = workoutToUpdate.exercises.splice(secondExerciseIndex, 1)
    let insertionIndex = firstExerciseIndex
    if (secondExerciseIndex < firstExerciseIndex) {
      insertionIndex--
    }
    workoutToUpdate.exercises.splice(insertionIndex + 1, 0, secondExercise)

    return workoutToUpdate
  }

  const getExerciseSuperset = (exerciseId) => {
    // find workout the exercise belongs to
    const workout = workouts.find((workout) => {
      return workout.exercises.find((exercise) => exercise.id === exerciseId)
    })
    if (!workout) {
      return null
    }
    return workout.supersets[exerciseId]
  }

  const removeSupersetForExercise = (workoutId, exerciseId) => {
    const updatedWorkouts = [...workouts]
    const workoutToUpdate = getWorkoutById(workoutId, updatedWorkouts)
    const linkedExercise = workoutToUpdate.supersets[exerciseId]

    delete workoutToUpdate.supersets[exerciseId]
    delete workoutToUpdate.supersets[linkedExercise]
    saveWorkoutsState(updatedWorkouts)
  }

  const getSupersetsForWorkout = (workoutId) => {
    const workout = getWorkoutById(workoutId, workouts)
    if (!workout.supersets) {
      workout.supersets = {}
    }
    return workout.supersets
  }

  return {
    isLoading,
    workouts,
    getWorkoutById,
    getWorkoutByExerciseId,
    getExerciseById,
    addCompletedSetToExercise,
    undoLastCompletedSetForExercise,
    updateExerciseWeightReps,
    updateExerciseName,
    updateExerciseNumSets,
    isEditingExercise,
    editExercise: () => setIsEditingExercise(true),
    stopEditingExercise: () => setIsEditingExercise(false),
    moveExerciseUp,
    completeWorkout,
    restoreLastWorkout,
    renameWorkout,
    archiveExercise,
    restoreExercise,
    deleteExercise,
    createExercise,
    deleteWorkout,
    createWorkout,
    createSuperset,
    removeSupersetForExercise,
    getExerciseSuperset,
    getSupersetsForWorkout,
  }
}

export const [WorkoutsProvider, useWorkoutsContext] = constate(useWorkouts)
