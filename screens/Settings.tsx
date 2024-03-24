import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import ScrollWithHeaderView from '@/components/ScrollWithHeaderView'
import BackButton from '@/components/base/BackButton'
import PressableView from '@/components/base/PressableView'
import tokens from '@/styles/tokens'
import { useSettingsContext } from '@/store/settings'

const styles = StyleSheet.create({
  settingsRow: {
    borderTopWidth: tokens.border.thinWidth,
    borderTopColor: tokens.border.separatorColor,
    paddingHorizontal: tokens.space.base,
    paddingVertical: tokens.space.half,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingsText: {
    fontSize: tokens.text.size.base,
    color: tokens.text.primaryColor,
  },
  incrementSettingDisplay: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  incrementNumber: {
    fontSize: tokens.text.size.base,
    color: tokens.text.secondaryColor,
  },
})

const SCREEN_NAME = 'Settings'

const Settings = ({ navigation, route }) => {
  const { incrementWeightBy } = useSettingsContext()

  return (
    <ScrollWithHeaderView
      header={'Settings'}
      showSmallHeaderOnScroll
      leftHeaderEl={<BackButton title={route.params.backName} />}
    >
      <PressableView
        style={styles.settingsRow}
        onPress={() => {
          navigation.navigate('WeightIncrement', { backName: SCREEN_NAME })
        }}
      >
        <Text style={styles.settingsText}>Weight Increment</Text>
        <View style={styles.incrementSettingDisplay}>
          <Text style={styles.incrementNumber}>{incrementWeightBy}</Text>
          <Ionicons
            name="chevron-forward-outline"
            size={32}
            color={tokens.text.secondaryColor}
          />
        </View>
      </PressableView>
      <PressableView
        style={styles.settingsRow}
        onPress={() => {
          navigation.navigate('PrivacyPolicy', { backName: SCREEN_NAME })
        }}
      >
        <Text style={styles.settingsText}>Privacy Policy</Text>
        <Ionicons
          name="chevron-forward-outline"
          size={32}
          color={tokens.text.secondaryColor}
        />
      </PressableView>
      <PressableView
        style={styles.settingsRow}
        onPress={() => {
          navigation.navigate('About', { backName: SCREEN_NAME })
        }}
      >
        <Text style={styles.settingsText}>About</Text>
        <Ionicons
          name="chevron-forward-outline"
          size={32}
          color={tokens.text.secondaryColor}
        />
      </PressableView>
      <PressableView
        style={styles.settingsRow}
        onPress={() => {
          navigation.navigate('DebugData', { backName: SCREEN_NAME })
        }}
      >
        <Text style={styles.settingsText}>Debug Data</Text>
        <Ionicons
          name="chevron-forward-outline"
          size={32}
          color={tokens.text.secondaryColor}
        />
      </PressableView>
    </ScrollWithHeaderView>
  )
}

export default Settings
