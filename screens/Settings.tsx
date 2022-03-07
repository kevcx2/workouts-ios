import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import ScrollWithHeaderView from '@/components/ScrollWithHeaderView'
import BackButton from '@/components/base/BackButton'
import { useWorkoutsContext } from '@/store/workouts'
import PressableView from '@/components/base/PressableView'
import tokens from '@/styles/tokens'

const styles = StyleSheet.create({
  settingsRow: {
    borderTopWidth: tokens.border.thinWidth,
    borderTopColor: tokens.border.separatorColor,
    paddingHorizontal: tokens.space.base,
    paddingVertical: tokens.space.half,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingsText: {
    fontSize: tokens.text.size.base,
    color: tokens.text.primaryColor,
  },
  policyTextArea: {
    borderTopWidth: tokens.border.thinWidth,
    borderTopColor: tokens.border.separatorColor,
    padding: tokens.space.base,
    paddingTop: 0,
  },
  policyText: {
    fontSize: tokens.text.size.base,
    color: tokens.text.primaryColor,
  },
})

const SCREEN_NAME = 'Settings'

const Settings = ({ navigation, route }) => {
  return (
    <ScrollWithHeaderView
      header={'Settings'}
      showSmallHeaderOnScroll
      leftHeaderEl={<BackButton title={route.params.backName} />}
    >
      <PressableView
        style={styles.settingsRow}
        onPress={() => {
          navigation.navigate('PrivacyPolicy', { backName: SCREEN_NAME })
        }}
      >
        <Text style={styles.settingsText}>Privacy Policy</Text>
        <Ionicons
          name="chevron-forward-outline"
          size={32}
          color={tokens.text.secondaryColor}
        />
      </PressableView>
      <PressableView
        style={styles.settingsRow}
        onPress={() => {
          navigation.navigate('About', { backName: SCREEN_NAME })
        }}
      >
        <Text style={styles.settingsText}>About</Text>
        <Ionicons
          name="chevron-forward-outline"
          size={32}
          color={tokens.text.secondaryColor}
        />
      </PressableView>
      <PressableView
        style={styles.settingsRow}
        onPress={() => {
          navigation.navigate('DebugData', { backName: SCREEN_NAME })
        }}
      >
        <Text style={styles.settingsText}>Debug Data</Text>
        <Ionicons
          name="chevron-forward-outline"
          size={32}
          color={tokens.text.secondaryColor}
        />
      </PressableView>
    </ScrollWithHeaderView>
  )
}

const PolicyText = ({ backName, title, text }) => {
  return (
    <ScrollWithHeaderView
      header={title}
      showSmallHeaderOnScroll
      leftHeaderEl={<BackButton title={backName} />}
    >
      <View style={styles.policyTextArea}>
        <Text selectable style={styles.policyText}>
          {text}
        </Text>
      </View>
    </ScrollWithHeaderView>
  )
}

const privacyPolicy = `
This privacy policy outlines the types of personal data we collect, how we use it, and the steps we take to ensure your data is handled appropriately. This policy applies to Workouts available on iOS devices.

1. Data Collection and Use

a. Data Collection: Workouts does not collect personal data from users. Our app is designed to store data locally on your device. This includes workout tracking information and preferences entered by you in the app. We do not have access to this data, nor do we collect, store, or process it in any way.

b. Usage Data: We do not track or collect any information regarding your usage of Workouts. Your interaction with the app remains private and is not monitored, analyzed, or shared.

2. Third-Party Data Sharing and Disclosure

Since Workouts does not collect personal data, we do not share or disclose any user data with third parties. This includes analytics tools, advertising networks, third-party SDKs, and related entities.

3. Data Retention and Deletion

As Workouts stores data only locally on your device, the retention and deletion of such data is under your control. You can manage and delete this data through the app's settings or by uninstalling the app from your device.

4. User Consent and Data Management

By using Workouts, you consent to the data practices described in this policy. Since we do not collect or store your data, there are no procedures for revoking consent or requesting data deletion from us. Any data created or stored by the app can be managed directly on your device.

5. Policy Changes

We may update our Privacy Policy from time to time. We encourage you to review this policy periodically for any changes.

6. Contact Us

If you have any questions about this privacy policy, please contact us at contact@workoutsios.com.
`
export const PrivacyPolicy = ({ route }) => {
  return (
    <PolicyText
      backName={route.params.backName}
      title={'Privacy Policy'}
      text={privacyPolicy}
    />
  )
}

const about = `
Distributed by Coxscript LLC

Source code available at:
https://github.com/kevcx2/workouts-ios
`
export const About = ({ route }) => {
  return <PolicyText backName={route.params.backName} title={'About'} text={about} />
}

export const DebugData = ({ route }) => {
  const { workouts } = useWorkoutsContext()

  return (
    <PolicyText
      backName={route.params.backName}
      title={'Debug Data'}
      text={JSON.stringify(workouts, null, 4)}
    />
  )
}

export default Settings
