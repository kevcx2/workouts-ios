import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import PressableView from '@/components/base/PressableView'
import ScrollWithHeaderView from '@/components/ScrollWithHeaderView'
import BackButton from '@/components/base/BackButton'
import tokens from '@/styles/tokens'
import { useSettingsContext } from '@/store/settings'
import { Ionicons } from '@expo/vector-icons'

const styles = StyleSheet.create({
  explainTextArea: {
    paddingTop: 0,
    padding: tokens.space.base,
  },
  explainText: {
    fontSize: tokens.text.size.base,
    color: tokens.text.primaryColor,
  },
  incrementOption: {
    borderTopWidth: tokens.border.thinWidth,
    borderTopColor: tokens.border.separatorColor,
    paddingHorizontal: tokens.space.base,
    paddingVertical: tokens.space.half,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 50,
  },
  incrementText: {
    fontSize: tokens.text.size.base,
    color: tokens.text.primaryColor,
  },
  hidden: {
    display: 'none',
  },
})

const explainText =
  'This is the smallest amount of weight you can add or remove to an exercise.'

const WeightIncrement = ({ backName }) => {
  const { incrementWeightBy, setIncrementWeightBy } = useSettingsContext()

  // render a list of inrement weight options: .25, .5, 2.5, 5. Use pressable view
  // to change the increment weight
  const incrementWeights = [0.25, 0.5, 2.5, 5]

  return (
    <ScrollWithHeaderView
      header={'Weight Increment'}
      showSmallHeaderOnScroll
      leftHeaderEl={<BackButton title={backName} />}
    >
      <View style={styles.explainTextArea}>
        <Text style={styles.explainText}>{explainText}</Text>
      </View>
      {incrementWeights.map((weight) => (
        <PressableView
          key={weight}
          style={styles.incrementOption}
          onPress={() => {
            setIncrementWeightBy(weight)
          }}
        >
          <Text style={styles.incrementText}>{weight}</Text>
          {weight === incrementWeightBy && (
            <Ionicons name="checkmark-outline" size={32} color={tokens.highlight} />
          )}
        </PressableView>
      ))}
    </ScrollWithHeaderView>
  )
}

export default WeightIncrement
