import * as React from 'react'
import { PlatformColor } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import DropdownMenu from '@/components/dropdown/DropdownMenu'

const ActionsMenu = ({ menuItems }) => {
  return (
    <DropdownMenu
      menuItems={menuItems}
      trigger={
        <Ionicons
          name="ellipsis-horizontal-circle"
          size={28}
          color={PlatformColor('link')}
        />
      }
    />
  )
}

export default ActionsMenu
