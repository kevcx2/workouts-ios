import * as React from 'react'
import { Text, Pressable, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'

import tokens from '@/styles/tokens'

const styles = StyleSheet.create({
  pressArea: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 1,
  },
  pressed: {
    opacity: 0.6,
  },
  text: {
    color: tokens.text.linkColor,
    fontSize: tokens.text.size.md,
    marginLeft: -3,
  },
})

function BackButton({ title = 'Back', onBack }) {
  const { useState } = React
  const navigation = useNavigation()

  const [isPressed, setIsPressed] = useState(false)
  const appliedStyles = [styles.pressArea]
  if (isPressed) {
    appliedStyles.push(styles.pressed)
  }

  return (
    <Pressable
      style={appliedStyles}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={() => {
        navigation.goBack()
        onBack && onBack()
      }}
      hitSlop={20}
    >
      <Ionicons
        name="chevron-back-outline"
        size={32}
        color={tokens.text.linkColor}
      />
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  )
}

export default BackButton
