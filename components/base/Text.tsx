import * as React from 'react'
import { Text as RNText } from 'react-native'

import tokens from '@/styles/tokens'

const textStyle = {
  fontSize: tokens.text.size.base,
}

const Text = ({ children, style }) => {
  return <RNText style={[textStyle, style]}>{children}</RNText>
}

export default Text
