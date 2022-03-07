import React, { useRef, useEffect } from 'react'
import { StyleSheet } from 'react-native'
import RBSheet from 'react-native-raw-bottom-sheet'

import tokens from '@/styles/tokens'

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'transparent',
  },
  container: {
    backgroundColor: tokens.background.secondary,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
  },
  draggableIcon: {
    display: 'none',
  },
})

const BottomSheet = ({ isOpen, children, height, onClose }) => {
  const sheetRef = useRef()

  useEffect(() => {
    if (isOpen && sheetRef.current) {
      sheetRef.current.open()
    }
    if (!isOpen && sheetRef.current) {
      sheetRef.current.close()
    }
  }, [isOpen])

  return (
    <RBSheet
      ref={sheetRef}
      closeOnDragDown={true}
      closeOnPressMask={true}
      customStyles={styles}
      height={height}
      closeDuration={200}
      openDuration={400}
      onClose={onClose}
      keyboardAvoidingViewEnabled={false}
    >
      {children}
    </RBSheet>
  )
}

export default BottomSheet
