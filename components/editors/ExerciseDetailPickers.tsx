import React from 'react'
import { Text, View, StyleSheet } from 'react-native'

import Picker from '@/components/base/Picker'
import { useSettingsContext } from '@/store/settings'
import tokens from '@/styles/tokens'

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  weightPickerContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: tokens.fill.quaternary,
    paddingTop: tokens.space.base,
    borderRadius: 12,
    marginRight: tokens.space.base,
  },
  pickerLabel: {
    fontSize: tokens.text.size.base,
    color: tokens.text.primaryColor,
  },
  repsPickerContainer: {
    flex: 1.5,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: tokens.fill.quaternary,
    paddingTop: tokens.space.base,
    borderRadius: 12,
  },
  repsDashAbsolutePosition: {
    marginTop: 96,
    marginLeft: -5,
    marginRight: -5,
  },
  repsDash: {
    color: tokens.text.secondaryColor,
    fontSize: 18,
    fontWeight: '600',
  },
  widePicker: {
    width: 115,
  },
  narrowPicker: {
    width: 85,
  },
  repsPickers: {
    display: 'flex',
    flexDirection: 'row',
  },
})

const ExerciseDetailPickers = ({ weight, repsLow, repsHigh, onChange }) => {
  const { incrementWeightBy } = useSettingsContext()
  const DEFAULT_INCREMENT_WEIGHT_BY = 2.5

  const onChangeWeight = (newWeight) => {
    onChange({
      weight: newWeight,
      repsLow,
      repsHigh,
    })
  }
  const onChangeRepsLow = (newRepsLow) => {
    onChange({
      weight,
      repsLow: newRepsLow,
      repsHigh,
    })
  }
  const onChangeRepsHigh = (newRepsHigh) => {
    onChange({
      weight,
      repsLow,
      repsHigh: newRepsHigh,
    })
  }

  return (
    <View style={styles.container} onStartShouldSetResponder={() => true}>
      <View style={styles.weightPickerContainer}>
        <Text style={styles.pickerLabel}>Weight</Text>
        <Picker
          style={styles.widePicker}
          selectedValue={weight}
          onValueChange={onChangeWeight}
          min={0}
          max={999}
          step={incrementWeightBy || DEFAULT_INCREMENT_WEIGHT_BY}
        />
      </View>
      <View style={styles.repsPickerContainer}>
        <Text style={styles.pickerLabel}>Target Reps</Text>
        <View style={styles.repsPickers}>
          <Picker
            style={styles.narrowPicker}
            selectedValue={repsLow}
            onValueChange={onChangeRepsLow}
            min={0}
            max={repsHigh}
            step={1}
          />
          <View style={styles.repsDashAbsolutePosition}>
            <Text style={styles.repsDash}>-</Text>
          </View>
          <Picker
            style={styles.narrowPicker}
            selectedValue={repsHigh}
            onValueChange={onChangeRepsHigh}
            min={repsLow}
            max={99}
            step={1}
          />
        </View>
      </View>
    </View>
  )
}

export default ExerciseDetailPickers
