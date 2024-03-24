import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import ScrollWithHeaderView from '@/components/ScrollWithHeaderView'
import BackButton from '@/components/base/BackButton'
import tokens from '@/styles/tokens'

const styles = StyleSheet.create({
  textBlockArea: {
    borderTopWidth: tokens.border.thinWidth,
    borderTopColor: tokens.border.separatorColor,
    padding: tokens.space.base,
    paddingTop: 0,
  },
  textBlock: {
    fontSize: tokens.text.size.base,
    color: tokens.text.primaryColor,
  },
})

const TextBlock = ({ backName, title, text }) => {
  return (
    <ScrollWithHeaderView
      header={title}
      showSmallHeaderOnScroll
      leftHeaderEl={<BackButton title={backName} />}
    >
      <View style={styles.textBlockArea}>
        <Text selectable style={styles.textBlock}>
          {text}
        </Text>
      </View>
    </ScrollWithHeaderView>
  )
}

export default TextBlock
