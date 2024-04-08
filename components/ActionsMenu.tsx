import * as React from 'react'
import { PlatformColor } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import DropdownMenu from '@/components/dropdown/DropdownMenu'

const ActionsMenu = ({ menuItems, icon = "ellipsis-horizontal-circle" }) => {
  return (
    <DropdownMenu
      menuItems={menuItems}
      trigger={
        <Ionicons
          name={icon}
          size={28}
          color={PlatformColor('link')}
        />
      }
    />
  )
}

export default ActionsMenu
