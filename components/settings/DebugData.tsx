import React from 'react'
import TextBlock from '@/components/settings/TextBlock'
import { useWorkoutsContext } from '@/store/workouts'
import { useStopwatchContext } from '@/store/stopwatch'
import { useSettingsContext } from '@/store/settings'

const DebugData = ({ route }) => {
  const { workouts } = useWorkoutsContext()
  const { formattedTime, isShowing } = useStopwatchContext()
  const { incrementWeightBy } = useSettingsContext()

  const store = {
    settings: { incrementWeightBy },
    stopwatch: { formattedTime, isShowing },
    workouts,
  }

  const debugText = JSON.stringify(store, null, 4)

  return (
    <TextBlock
      backName={route.params.backName}
      title={'Debug Data'}
      text={debugText}
    />
  )
}

export default DebugData
