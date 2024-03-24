import React from 'react'
import TextBlock from '@/components/settings/TextBlock'

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

const PrivacyPolicy = ({ route }) => {
  return (
    <TextBlock
      backName={route.params.backName}
      title={'Privacy Policy'}
      text={privacyPolicy}
    />
  )
}

export default PrivacyPolicy
