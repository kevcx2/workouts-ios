import { useState } from 'react'
import { Animated, Easing } from 'react-native'
import * as Haptics from 'expo-haptics'

const DRAWER_OPEN_DISTANCE = 75
const DRAWER_CLOSE_DISTANCE = -75
const STAY_OPEN_DISTANCE = 125
const SWIPE_SLOP = 50
const CLOSE_ANIM_DURATION = 300

// Calculate how far the current gesture has swiped.
// Take into account some 'slop', or buffer space that we
// allocate. The slop distance is the distance a gesture can
// move before we want to start counting it towards the swipe
// distance. Because human fingers are imprecise, we don't want
// to start triggering the swipe's effects until some threshold
// slop distance has been swiped.
const calculateSwipeDistance = (gesture) => {
  if (gesture === undefined) return undefined

  let swipeDistance = gesture.y - gesture.startY

  if (Math.abs(swipeDistance) > SWIPE_SLOP) {
    if (swipeDistance < 0) {
      swipeDistance = swipeDistance + SWIPE_SLOP
    } else if (swipeDistance > 0) {
      swipeDistance = swipeDistance - SWIPE_SLOP
    }
    return swipeDistance
  } else {
    return 0
  }
}

// Takes the swipe distance and projects it to a percentage
// that represents how 'open' the drawer is
const calculatePercentageOpen = (swipeDistance) => {
  let percentOpen = swipeDistance / DRAWER_OPEN_DISTANCE
  // Clamp value to a 0...1 range
  percentOpen = Math.min(percentOpen, 1)
  percentOpen = Math.max(percentOpen, 0)
  return percentOpen
}

const useTopDrawer = (gesture) => {
  const [percentOpen] = useState(new Animated.Value(0))
  const [drawerState, setDrawerState] = useState('CLOSED')

  const swipeDistance = calculateSwipeDistance(gesture)
  const closeAnimationFromCurrentPosition = Animated.timing(percentOpen, {
    toValue: 0,
    // Hack: If we are closing a drawer that is only partially open,
    // we want a faster close animation. This hack uses the Animated.Value
    // internal _value property to scale the animation time with the
    // amount that the drawer is currently open.
    duration: CLOSE_ANIM_DURATION * percentOpen._value,
    easing: Easing.quadratic,
    useNativeDriver: false,
  })

  // If the drawer is closed, a swipe begins opening it
  if (drawerState === 'CLOSED') {
    if (gesture) {
      percentOpen.setValue(calculatePercentageOpen(swipeDistance))
      // After a certain distance, the drawer is pinned open
      // and stays open, even on gesture release
      if (swipeDistance >= STAY_OPEN_DISTANCE) {
        setDrawerState('OPEN')
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      }
    } else {
      // If we gesture ends, we begin the close animation
      closeAnimationFromCurrentPosition.start()
    }
  }
  // If the drawer is open and a swipe up crosses the DRAWER_CLOSE_DISTANCE
  // threshold, we trigger the close animation and set the drawer state as
  // closing.
  if (drawerState === 'OPEN') {
    if (gesture) {
      if (swipeDistance < DRAWER_CLOSE_DISTANCE) {
        setDrawerState('CLOSING')
        closeAnimationFromCurrentPosition.start(() => {
          setDrawerState('CLOSED')
        })
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      }
    }
  }

  return {
    percentOpen,
  }
}

export default useTopDrawer
