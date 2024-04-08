import React from 'react'
import { View, StyleSheet, Alert, PlatformColor } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import PressableView from '@/components/base/PressableView'

const styles = StyleSheet.create({
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
})

function ExerciseEditButtons({
  onMoveExerciseUp,
  onEditExercise,
  onArchiveExercise,
}) {
  return (
    <View style={styles.actions}>
      <PressableView pressedStyle={styles.actionPressed} onPress={onMoveExerciseUp}>
        <Ionicons
          style={styles.actionIcon}
          name="chevron-up-outline"
          size={24}
          color={PlatformColor('link')}
        />
      </PressableView>
      <PressableView pressedStyle={styles.actionPressed} onPress={onEditExercise}>
        <Ionicons
          style={styles.actionIcon}
          name="create-outline"
          size={24}
          color={PlatformColor('link')}
        />
      </PressableView>
      <PressableView
        pressedStyle={styles.actionPressed}
        onPress={() => {
          Alert.alert(
            'Remove Exercise',
            'Your exercise history will be saved, and the exercise will be removed from this workout',
            [
              {
                text: 'No',
                style: 'cancel',
              },
              {
                text: 'Yes',
                onPress: onArchiveExercise,
              },
            ],
          )
        }}
      >
        <Ionicons
          style={styles.actionIcon}
          name="trash-outline"
          size={24}
          color={PlatformColor('systemRed')}
        />
      </PressableView>
    </View>
  )
}

export default ExerciseEditButtons
