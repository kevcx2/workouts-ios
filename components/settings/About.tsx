import React from 'react'
import TextBlock from '@/components/settings/TextBlock'

const about = `
Distributed by Coxscript LLC

Source code available at:
https://github.com/kevcx2/workouts-ios
`
const About = ({ route }) => {
  return <TextBlock backName={route.params.backName} title={'About'} text={about} />
}

export default About
