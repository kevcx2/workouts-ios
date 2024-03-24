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
      exercise.id = createId()
    })
    saveWorkoutsState(updatedWorkouts)
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
    const updatedWorkouts = [...workouts]
    saveWorkoutsState(moveExercise(updatedWorkouts, workoutId, exerciseId, 'back'))
  }

  // eslint-disable-next-line no-shadow
  const moveExercise = (workouts, workoutId, exerciseId, direction) => {
    return workouts.map((workout) => {
      if (workout.id !== workoutId) return workout
      // Find the index of the exercise
      const exerciseIndex = workout.exercises.findIndex(
        (exercise) => exercise.id === exerciseId,
      )
      // Check if the exercise is found or already at the boundary
      const atStart = exerciseIndex === 0 && direction === 'back'
      const atEnd =
        exerciseIndex === workout.exercises.length - 1 && direction === 'forward'
      if (exerciseIndex === -1 || atStart || atEnd) return workout

      // Remove the exercise from the current index
      const [exercise] = workout.exercises.splice(exerciseIndex, 1)
      // Calculate new index
      const newIndex = exerciseIndex + (direction === 'forward' ? 1 : -1)
      // Add the exercise into the new index
      workout.exercises.splice(newIndex, 0, exercise)
      return workout
    })
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

  return {
    isLoading,
    workouts,
    getWorkoutById,
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
  }
}

export const [WorkoutsProvider, useWorkoutsContext] = constate(useWorkouts)
