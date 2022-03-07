import React from 'react'

import HeaderView from '@/components/HeaderView'
import BackButton from '@/components/base/BackButton'
import ActionsMenu from '@/components/ActionsMenu'
import Set from '@/components/set/Set'
import { useWorkoutsContext } from '@/store/workouts'
import { useStopwatchContext } from '@/store/stopwatch'

const ExerciseSet = ({ route }) => {
  const { exerciseId } = route.params
  const { getExerciseById, editExercise } = useWorkoutsContext()
  const { isShowing, show, hide, reset } = useStopwatchContext()

  const exercise = getExerciseById(exerciseId)

  const headerActions = [
    {
      title: isShowing ? 'Hide timer' : 'Show timer',
      action: isShowing ? hide : show,
      icon: 'timer-outline',
    },
    {
      title: 'Reset timer',
      action: reset,
      icon: 'refresh-outline',
    },
    {
      title: 'Edit exercise',
      action: editExercise,
      icon: 'create-outline',
    },
  ]

  return (
    <HeaderView
      header={exercise.name}
      leftHeaderEl={<BackButton />}
      rightHeaderEl={<ActionsMenu menuItems={headerActions} />}
    >
      <Set exercise={exercise} />
    </HeaderView>
  )
}

export default ExerciseSet
