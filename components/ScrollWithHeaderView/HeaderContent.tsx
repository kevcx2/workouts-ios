import * as React from 'react'
import { View, SafeAreaView, StyleSheet, PlatformColor } from 'react-native'

import Text from '@/components/base/Text'
import FadeInOut from '@/components/animation/FadeInOut'
import tokens from '@/styles/tokens'

import headerTokens from './headerTokens'

const styles = StyleSheet.create({
  header: headerTokens.fixedHeaderStyle,
  headerContentArea: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.space.base,
  },
  smallHeaderContainer: {
    marginLeft: 10,
    marginRight: 10,
    overflow: 'hidden',
  },
  smallHeaderText: {
    fontWeight: '600',
    color: PlatformColor('label'),
  },
  leftHeaderElContainer: {
    width: 85,
    display: 'flex',
    alignItems: 'flex-start',
    marginLeft: tokens.space.half,
  },
  rightHeaderElContainer: {
    width: 85,
    display: 'flex',
    alignItems: 'flex-end',
    marginRight: tokens.space.half,
  },
})

const HeaderContent = ({
  leftHeaderEl,
  rightHeaderEl,
  headerText,
  isScrolledPastHeader,
  showSmallHeaderOnScroll,
}) => {
  return (
    <View style={[styles.header]}>
      <SafeAreaView style={styles.headerContentArea}>
        <View style={styles.leftHeaderElContainer}>{leftHeaderEl}</View>
        {showSmallHeaderOnScroll ? (
          <FadeInOut
            style={styles.smallHeaderContainer}
            isVisible={isScrolledPastHeader}
            renderWhileHidden={true}
          >
            <Text style={styles.smallHeaderText}>{headerText}</Text>
          </FadeInOut>
        ) : null}
        <View style={styles.rightHeaderElContainer}>{rightHeaderEl}</View>
      </SafeAreaView>
    </View>
  )
}

export default HeaderContent
