import React from 'react'
import { View, StyleSheet, PlatformColor } from 'react-native'
import dayjs from 'dayjs'
import { Ionicons } from '@expo/vector-icons'

import ActionsMenu from '@/components/ActionsMenu'
import Strong from '@/components/base/Strong'
import Text from '@/components/base/Text'
import PressableView from '@/components/base/PressableView'
import ScrollWithHeaderView from '@/components/ScrollWithHeaderView'
import tokens from '@/styles/tokens'
import { useWorkoutsContext } from '@/store/workouts'

const formatWorkouts = (workouts) => {
  const formattedWorkouts = workouts.map((workout) => {
    let lastCompletedAt = workout.lastCompletedAt
      ? dayjs(workout.lastCompletedAt).format('MMM D')
      : 'New'
    return { ...workout, lastCompletedAt }
  })
  return formattedWorkouts
}
const SCREEN_NAME = 'Workouts'

const styles = StyleSheet.create({
  emptyGuideArea: {
    width: '100%',
    borderTopWidth: tokens.border.thinWidth,
    borderTopColor: tokens.border.separatorColor,
  },
  createWorkout: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: tokens.background.secondary,
    padding: tokens.space.base,
    margin: tokens.space.base,
    borderRadius: 12,
  },
  createWorkoutText: {
    color: tokens.text.secondaryColor,
  },
  createWorkoutIcons: {
    display: 'flex',
    flexDirection: 'row',
  },
})

const Workouts = ({ navigation }) => {
  let { workouts, createWorkout } = useWorkoutsContext()
  const sortedWorkouts = workouts.sort((a, b) => {
    if (!a.lastCompletedAt && !b.lastCompletedAt) {
      return 0
    }
    if (!a.lastCompletedAt) {
      return -1
    }
    if (!b.lastCompletedAt) {
      return 1
    }

    const dateA = new Date(a.lastCompletedAt)
    const dateB = new Date(b.lastCompletedAt)
    return dateA - dateB
  })
  const formattedWorkouts = formatWorkouts(sortedWorkouts)

  const hasNoWorkouts = workouts.length === 0
  const onCreateWorkout = () => {
    const createdWorkout = createWorkout()
    navigation.navigate('EditWorkout', {
      workoutId: createdWorkout.id,
      backName: SCREEN_NAME,
    })
  }

  const headerActions = [
    {
      title: 'Create workout',
      action: onCreateWorkout,
      icon: 'add-circle-outline',
    },
    {
      title: 'Settings',
      action: () => navigation.navigate('Settings', { backName: SCREEN_NAME }),
      icon: 'settings-outline',
    },
  ]

  return (
    <ScrollWithHeaderView
      header={SCREEN_NAME}
      showSmallHeaderOnScroll={true}
      rightHeaderEl={<ActionsMenu menuItems={headerActions} />}
    >
      <View>
        {formattedWorkouts.map((workout) => (
          <WorkoutListItem
            key={`${workout.id}`}
            name={workout.name}
            lastCompletedAt={workout.lastCompletedAt}
            onPress={() =>
              navigation.navigate('Workout', {
                workoutId: workout.id,
                backName: SCREEN_NAME,
              })
            }
          />
        ))}
      </View>
      {hasNoWorkouts && (
        <View style={styles.emptyGuideArea}>
          <PressableView style={styles.createWorkout} onPress={onCreateWorkout}>
            <Text style={styles.createWorkoutText}>Create a workout</Text>
            <View style={styles.createWorkoutIcons}>
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
                name="add-circle-outline"
                size={24}
                color={tokens.text.secondaryColor}
              />
            </View>
          </PressableView>
        </View>
      )}
    </ScrollWithHeaderView>
  )
}

const workoutListItemStyles = StyleSheet.create({
  contentArea: {
    borderTopWidth: tokens.border.thinWidth,
    borderTopColor: tokens.border.separatorColor,
    padding: tokens.space.base,
  },
  name: {
    color: PlatformColor('label'),
  },
  lastCompleted: {
    marginTop: tokens.space.small,
    color: PlatformColor('secondaryLabel'),
  },
})

const WorkoutListItem = ({ name, lastCompletedAt, onPress }) => {
  return (
    <PressableView onPress={onPress}>
      <View style={workoutListItemStyles.contentArea}>
        <Strong style={workoutListItemStyles.name}>{name}</Strong>
        <Text style={workoutListItemStyles.lastCompleted}>{lastCompletedAt}</Text>
      </View>
    </PressableView>
  )
}

export default Workouts
