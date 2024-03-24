import React from 'react'
import { StyleSheet } from 'react-native'
import { Picker as RNPicker } from '@react-native-picker/picker'

import tokens from '@/styles/tokens'

const createRange = (min, max, step) => {
  const range = []
  for (let i = min; i <= max; i += step) {
    range.push(i)
  }
  return range
}

const styles = StyleSheet.create({
  pickerItem: {
    color: tokens.text.primaryColor,
    fontSize: tokens.text.size.md,
  },
})

const Picker = ({ style, selectedValue, onValueChange, min, max, step }) => {
  const pickRange = createRange(min, max, step)

  return (
    <RNPicker
      style={style}
      selectedValue={selectedValue}
      onValueChange={onValueChange}
      itemStyle={styles.pickerItem}
    >
      {pickRange.map((value) => (
        <RNPicker.Item value={value} label={`${value}`} key={value} />
      ))}
    </RNPicker>
  )
}

export default Picker
