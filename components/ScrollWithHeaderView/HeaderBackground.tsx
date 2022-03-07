import * as React from 'react'
import { View, StyleSheet, PlatformColor, useColorScheme } from 'react-native'
import { BlurView } from 'expo-blur'

import tokens from '@/styles/tokens'

import headerTokens from './headerTokens'

const styles = StyleSheet.create({
  header: headerTokens.fixedHeaderStyle,
  blurLayer: {
    borderBottomWidth: tokens.border.thinWidth,
    borderBottomColor: tokens.border.separatorColor,
  },
  tintLayer1: {
    opacity: 0.2,
    backgroundColor: tokens.background.secondary,
  },
  tintLayer2: {
    backgroundColor: tokens.background.primary,
  },
})

const HeaderBackground = ({ scrollBasedOpacity }) => {
  return (
    <React.Fragment>
      <BlurView
        intensity={useColorScheme() === 'dark' ? 80 : 95}
        style={[styles.header, styles.blurLayer]}
        tint={useColorScheme()}
      />
      <View style={[styles.header, styles.tintLayer1]} />
      <View
        style={[
          styles.header,
          styles.tintLayer2,
          {
            opacity: 1 - scrollBasedOpacity - 0.05,
            backgroundColor: PlatformColor('systemBackground'),
          },
        ]}
      />
    </React.Fragment>
  )
}

export default HeaderBackground
