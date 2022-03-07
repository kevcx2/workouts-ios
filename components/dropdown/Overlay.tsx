import * as React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: -1000,
    left: -1000,
    width: 5000,
    height: 5000,
    backgroundColor: 'transparent',
  },
})

const Overlay = ({ onPress }) => {
  return (
    <Pressable onPressIn={onPress}>
      <View style={styles.overlay} />
    </Pressable>
  )
}

export default Overlay
