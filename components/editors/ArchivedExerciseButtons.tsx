import React from 'react'
import { View, PlatformColor, Alert } from 'react-native'
import PressableView from '@/components/base/PressableView'
import { Ionicons } from '@expo/vector-icons'

const ArchivedExerciseButtons = ({ onRestoreExercise, onDeleteExercise }) => {
  const styles = {
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
  }

  return (
    <View style={styles.actions}>
      <PressableView pressedStyle={styles.actionPressed} onPress={onRestoreExercise}>
        <Ionicons
          style={styles.actionIcon}
          name="arrow-undo-outline"
          size={24}
          color={PlatformColor('link')}
        />
      </PressableView>
      <PressableView
        pressedStyle={styles.actionPressed}
        onPress={() => {
          Alert.alert(
            'Delete exercise',
            'This will permanently delete this exercise and all related workout data',
            [
              {
                text: 'No',
                style: 'cancel',
              },
              {
                text: 'Yes',
                onPress: onDeleteExercise,
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

export default ArchivedExerciseButtons
