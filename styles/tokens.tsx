import { PlatformColor } from 'react-native'

const BASE_DIST = 15

const styleTokens = {
  space: {
    double: BASE_DIST * 2,
    base: BASE_DIST,
    half: BASE_DIST / 2,
    small: 5,
  },
  border: {
    thinWidth: 0.25,
    separatorColor: PlatformColor('separator'),
  },
  background: {
    primary: PlatformColor('systemBackground'),
    secondary: PlatformColor('secondarySystemBackground'),
    tertiary: PlatformColor('tertiarySystemBackground'),
  },
  fill: {
    primary: PlatformColor('systemFill'),
    secondary: PlatformColor('secondarySystemFill'),
    tertiary: PlatformColor('tertiarySystemFill'),
    quaternary: PlatformColor('quaternarySystemFill'),
  },
  text: {
    primaryColor: PlatformColor('label'),
    secondaryColor: PlatformColor('secondaryLabel'),
    linkColor: PlatformColor('link'),
    dangerColor: PlatformColor('systemOrange'),
    size: {
      base: 16,
      md: 17,
      lg: 19,
    },
  },
  header: {
    height: 90,
  },
  highlight: PlatformColor('systemBlue'),
}

export default styleTokens
