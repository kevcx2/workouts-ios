import React from 'react'

import { StyleSheet, Text, Pressable } from 'react-native'
import { useStopwatchContext } from '@/store/stopwatch'
import tokens from '@/styles/tokens'
import ShrinkInOut from '@/components/animation/ShrinkInOut'

const styles = StyleSheet.create({
  elapsedTime: {
    fontSize: 52,
    fontWeight: '300',
    color: tokens.text.secondaryColor,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
    marginBottom: tokens.space.half,
  },
})

const ElapsedTime = () => {
  const { formattedTime, toggle, isShowing } = useStopwatchContext()
  const { minutes, seconds, deciseconds } = formattedTime

  return (
    <ShrinkInOut isVisible={isShowing} height={68}>
      <Pressable onPress={() => toggle()}>
        <Text
          style={styles.elapsedTime}
        >{`${minutes}:${seconds}.${deciseconds}`}</Text>
      </Pressable>
    </ShrinkInOut>
  )
}

export default ElapsedTime
