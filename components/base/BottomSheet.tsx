import React, { useState, useRef, useEffect } from 'react'
import {
  Dimensions,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Modal,
  View,
} from 'react-native'

import useGesture from '@/components/gesture/useGesture'
import { useBackdropContext } from '@/components/Backdrop'
import tokens from '@/styles/tokens'

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  mask: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    backgroundColor: tokens.background.secondary,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    width: '100%',
  },
})

const TOP_MARGIN = 75
const OPEN_DURATION = 400
const CLOSE_DURATION = 300
const SWIPE_CLOSE_DURATION = 200
const SNAP_DURATION = 100
const SNAP_DISTANCE = 150
const UPPER_STRETCH = 50

const BottomSheet = ({ isOpen, children, onClose }) => {
  // Calculate height based on screen dimensions
  const screenHeight = Dimensions.get('window').height
  const height = screenHeight - TOP_MARGIN

  const [isVisible, setIsVisible] = useState(isOpen)
  const animatedHeight = useRef(new Animated.Value(0)).current
  const backdrop = useBackdropContext()

  // Functions to animate opening & closing the sheet
  const animateOpen = () => {
    backdrop.show()
    setIsVisible(true)
    Animated.timing(animatedHeight, {
      toValue: height,
      duration: OPEN_DURATION,
      useNativeDriver: false,
    }).start()
  }
  const animateSnapToHeight = () => {
    Animated.timing(animatedHeight, {
      toValue: height,
      duration: SNAP_DURATION,
      useNativeDriver: false,
    }).start()
  }
  // Slower close animation when the sheet is dismissed
  // from full height
  const animateClosed = () => {
    backdrop.hide()
    Animated.timing(animatedHeight, {
      toValue: 0,
      duration: CLOSE_DURATION,
      useNativeDriver: false,
    }).start(() => {
      setIsVisible(false)
    })
  }
  // Faster close animation when the sheet is dismissed
  // via swipe down
  const animateSwipeClose = () => {
    backdrop.hide()
    Animated.timing(animatedHeight, {
      toValue: 0,
      duration: SWIPE_CLOSE_DURATION,
      useNativeDriver: false,
    }).start(() => {
      setIsVisible(false)
      onClose()
    })
  }

  useEffect(() => {
    if (isOpen) {
      animateOpen()
    } else {
      animateClosed()
    }
  }, [isOpen])

  const { onGestureMove, onGestureEnd, gesture } = useGesture({
    onChange: (gesture) => {
      if (!gesture) return
      let swipeDistance = gesture.y - gesture.startY
      // Scale the swipe distance down when swiping up, to make a stretch
      // or resistance effect
      if (swipeDistance < 0) swipeDistance /= 3
      if (swipeDistance < -UPPER_STRETCH) swipeDistance = -UPPER_STRETCH
      animatedHeight.setValue(height - swipeDistance)
      backdrop.setPercentageVisible((height - swipeDistance) / height)
    },
    onEnd: () => {
      if (!gesture) return
      let swipeDistance = gesture.y - gesture.startY
      // If the sheet is swiped down more than the snap distance,
      // close the sheet. Otherwise, snap the sheet back to its original height
      if (swipeDistance > SNAP_DISTANCE) {
        animateSwipeClose()
      } else {
        animateSnapToHeight()
        backdrop.setPercentageVisible(1)
      }
    },
  })

  return (
    <Modal transparent visible={isVisible} onRequestClose={onClose}>
      <View style={styles.wrapper}>
        <TouchableOpacity style={styles.mask} activeOpacity={1} onPress={onClose} />
        <Animated.View
          style={[styles.container, { height: animatedHeight }]}
          onStartShouldSetResponder={() => true}
          onResponderMove={(event) => {
            onGestureMove(event)
          }}
          onResponderRelease={() => {
            onGestureEnd()
          }}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  )
}

export default BottomSheet
