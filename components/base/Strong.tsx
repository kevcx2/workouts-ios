import * as React from 'react'
import { Text } from 'react-native'

import tokens from '@/styles/tokens'

const strongStyle = {
  color: tokens.text.primaryColor,
  fontSize: tokens.text.size.md,
  fontWeight: '600',
}

const Strong = ({ children, style }) => {
  return <Text style={[strongStyle, style]}>{children}</Text>
}

export default Strong
