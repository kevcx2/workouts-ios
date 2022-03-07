import * as React from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'

import Header from '@/components/base/Header'
import tokens from '@/styles/tokens'

import HeaderBackground from './HeaderBackground'
import HeaderContent from './HeaderContent'

const styles = StyleSheet.create({
  body: {
    display: 'flex',
    backgroundColor: tokens.background.primary,
    height: '100%',
  },
  bigHeaderText: {
    color: tokens.text.primaryColor,
  },
  headerSpacer: {
    height: tokens.header.height,
  },
  headerChildren: {
    flex: 1,
  },
})

const ScrollWithHeaderView = ({
  children,
  header,
  leftHeaderEl,
  rightHeaderEl,
  showSmallHeaderOnScroll,
}) => {
  const { useState } = React

  const [isScrolledPastHeader, setIsScrolledPastHeader] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [scrollBasedOpacity, setScrollBasedOpacity] = useState(0)

  const onBodyScroll = ({ nativeEvent }) => {
    const SCROLL_PAST_HEADER_DISTANCE = 38

    let scrollDistance = Math.max(0, nativeEvent.contentOffset.y)
    setScrollBasedOpacity(
      Math.min(scrollDistance, SCROLL_PAST_HEADER_DISTANCE) *
        (1 / SCROLL_PAST_HEADER_DISTANCE),
    )

    if (
      nativeEvent.contentOffset.y > SCROLL_PAST_HEADER_DISTANCE &&
      !isScrolledPastHeader
    ) {
      setIsScrolledPastHeader(true)
    } else if (
      nativeEvent.contentOffset.y < SCROLL_PAST_HEADER_DISTANCE &&
      isScrolledPastHeader
    ) {
      setIsScrolledPastHeader(false)
    }

    if (scrollDistance > 5 && !isScrolled) {
      setIsScrolled(true)
    } else if (scrollDistance < 5 && isScrolled) {
      setIsScrolled(false)
    }
  }

  const scrollBasedOpacityStyle = {
    opacity: showSmallHeaderOnScroll ? 1 - scrollBasedOpacity : 1,
  }

  return (
    <View style={styles.body}>
      <ScrollView
        onScroll={onBodyScroll}
        scrollEventThrottle={20}
        decelerationRate={0.997}
      >
        <View style={styles.headerSpacer} />
        <Header style={[styles.bigHeaderText, scrollBasedOpacityStyle]}>
          {header}
        </Header>
        <View style={styles.headerChildren}>{children}</View>
      </ScrollView>
      <HeaderBackground scrollBasedOpacity={scrollBasedOpacity} />
      <HeaderContent
        rightHeaderEl={rightHeaderEl}
        leftHeaderEl={leftHeaderEl}
        headerText={header}
        isScrolledPastHeader={isScrolledPastHeader}
        showSmallHeaderOnScroll={showSmallHeaderOnScroll}
      />
    </View>
  )
}

export default ScrollWithHeaderView
