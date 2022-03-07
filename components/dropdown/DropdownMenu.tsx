import * as React from 'react'
import { View, Pressable, PlatformColor, StyleSheet } from 'react-native'
import * as Haptics from 'expo-haptics'
import { Ionicons } from '@expo/vector-icons'

import Text from '@/components/base/Text'
import TransformInOut from '@/components/animation/TransformInOut'
import FadeInOut from '@/components/animation/FadeInOut'
import PressableView from '@/components/base/PressableView'
import Overlay from '@/components/dropdown/Overlay'
import tokens from '@/styles/tokens'

const contextMenuWrapperStyle = {
  zIndex: 100,
}

const DropdownMenu = ({ trigger, menuItems }) => {
  const { useState, useEffect } = React
  const [isMenuVisible, setIsMenuVisible] = useState(false)
  const [isMenuClosing, setIsMenuClosing] = useState(false)

  useEffect(() => {
    if (isMenuVisible) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    }
  }, [isMenuVisible])

  const onToggleMenu = () => {
    if (isMenuClosing) {
      return
    } else {
      if (isMenuVisible) {
        setIsMenuClosing(true)
      }
      setIsMenuVisible(!isMenuVisible)
    }
  }

  return (
    <View style={contextMenuWrapperStyle}>
      <FadeInOut isVisible={isMenuVisible}>
        <Overlay
          onPress={() => {
            setIsMenuVisible(false)
          }}
        />
      </FadeInOut>
      <FadeInOut isVisible={!isMenuVisible} endValue={0.5} renderWhileHidden={true}>
        <Pressable onPress={onToggleMenu} hitSlop={30}>
          {trigger}
        </Pressable>
      </FadeInOut>
      <FadeInOut
        isVisible={isMenuVisible}
        onFadeOut={() => {
          setIsMenuClosing(false)
        }}
      >
        <TransformInOut
          isTransformed={isMenuVisible}
          transformProperties={['scaleX', 'scaleY']}
          startValue={1}
          endValue={0.5}
        >
          <DropdownMenuPopup menuItems={menuItems} onSelectItem={onToggleMenu} />
        </TransformInOut>
      </FadeInOut>
    </View>
  )
}

const styles = StyleSheet.create({
  popup: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.125,
    shadowRadius: 4,
    elevation: 2,
    marginTop: tokens.space.half,
    backgroundColor: PlatformColor('tertiarySystemBackground'),
    position: 'absolute',
    top: 0,
    left: -200,
    borderRadius: 16,
    width: 225,
  },
  menuItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: tokens.space.base,
    borderBottomColor: tokens.border.separatorColor,
  },
  menuItemText: {
    color: tokens.text.primaryColor,
    fontSize: tokens.text.size.md,
  },
})

const DropdownMenuPopup = ({ menuItems, onSelectItem }) => {
  return (
    <View opacity={1} style={styles.popup}>
      {(menuItems || []).map((menuItem, i) => (
        <DropdownMenuItem
          key={menuItem.title}
          title={menuItem.title}
          icon={menuItem.icon}
          action={menuItem.action}
          isLast={i === menuItems.length - 1}
          isFirst={i === 0}
          onSelect={onSelectItem}
        />
      ))}
    </View>
  )
}

const DropdownMenuItem = ({ icon, title, action, isLast, isFirst, onSelect }) => {
  const borderRadiusDynamicStyle = {
    borderTopLeftRadius: isFirst ? 16 : 0,
    borderTopRightRadius: isFirst ? 16 : 0,
    borderBottomLeftRadius: isLast ? 16 : 0,
    borderBottomRightRadius: isLast ? 16 : 0,
  }
  const borderDynamicStyle = {
    borderBottomWidth: isLast ? 0 : tokens.border.thinWidth,
  }

  return (
    <PressableView
      onPress={() => {
        action()
        onSelect()
      }}
      style={borderRadiusDynamicStyle}
    >
      <View style={[styles.menuItem, borderDynamicStyle]}>
        <Text style={styles.menuItemText}>{title}</Text>
        <Ionicons name={icon} size={22} color={tokens.text.primaryColor} />
      </View>
    </PressableView>
  )
}

export default DropdownMenu
