import * as React from 'react'
import { View, StyleSheet } from 'react-native'

import Header from '@/components/base/Header'
import tokens from '@/styles/tokens'

import HeaderContent from '@/components/ScrollWithHeaderView/HeaderContent'

const styles = StyleSheet.create({
  body: {
    display: 'flex',
    backgroundColor: tokens.background.primary,
    height: '100%',
  },
  headerSpacer: {
    height: tokens.header.height,
  },
  bigHeaderText: {
    color: tokens.text.primaryColor,
  },
  headerChildren: {
    flex: 1,
  },
})

const HeaderView = ({ children, header, leftHeaderEl, rightHeaderEl }) => {
  return (
    <View style={styles.body}>
      <View style={styles.headerSpacer} />
      <Header style={styles.bigHeaderText}>{header}</Header>
      <View style={styles.headerChildren}>{children}</View>
      <HeaderContent rightHeaderEl={rightHeaderEl} leftHeaderEl={leftHeaderEl} />
    </View>
  )
}

export default HeaderView
