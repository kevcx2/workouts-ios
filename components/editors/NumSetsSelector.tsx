// React native component
import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import PressableView from '@/components/base/PressableView'
import tokens from '@/styles/tokens'

const styles = StyleSheet.create({
  setsInputArea: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  setsInput: {
    width: 133,
    display: 'flex',
    flexDirection: 'row',
    color: tokens.text.primaryColor,
    backgroundColor: tokens.background.tertiary,
    marginBottom: tokens.space.base,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  setsLabelText: {
    color: tokens.text.primaryColor,
    fontSize: tokens.text.size.base,
  },
  setsInputText: {
    color: tokens.text.secondaryColor,
    fontSize: tokens.text.size.base,
    paddingLeft: 24,
  },
  setsAdjustment: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: tokens.background.tertiary,
    marginBottom: tokens.space.base,
    borderRadius: 12,
    paddingVertical: 7,
    marginLeft: 12,
  },
})

const MAX_SETS = 18

const NumSetsSelector = ({ numSets, setNumSets }) => {
  return (
    <View style={styles.setsInputArea}>
      <View style={styles.setsInput}>
        <Text style={styles.setsLabelText}>Sets</Text>
        <Text style={styles.setsInputText}>{numSets}</Text>
      </View>
      <PressableView
        style={styles.setsAdjustment}
        onPress={() => {
          const nextNumSets = numSets + 1
          setNumSets(Math.min(nextNumSets, MAX_SETS))
        }}
      >
        <Ionicons
          name="add-outline"
          size={24}
          color={tokens.text.secondaryColor}
        />
      </PressableView>
      <PressableView
        style={styles.setsAdjustment}
        onPress={() => {
          const nextNumSets = numSets - 1
          setNumSets(Math.max(nextNumSets, 1))
        }}
      >
        <Ionicons
          name="remove-outline"
          size={24}
          color={tokens.text.secondaryColor}
        />
      </PressableView>
    </View>
  )
}

export default NumSetsSelector
