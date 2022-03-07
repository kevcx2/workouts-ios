import * as React from 'react'
import { Text } from 'react-native'

import tokens from '@/styles/tokens'

const headerStyle = {
  fontSize: 34,
  fontWeight: '700',
  marginLeft: tokens.space.base,
  marginRight: tokens.space.base,
  marginBottom: tokens.space.half + 1,
}

const Header = ({ children, style }) => {
  return <Text style={[headerStyle, style]}>{children}</Text>
}

export default Header
