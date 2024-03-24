import React from 'react'
import { View, StyleSheet } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { WorkoutsProvider, useWorkoutsContext } from '@/store/workouts'
import { StopwatchProvider } from '@/store/stopwatch'
import { SettingsProvider } from './store/settings'

import Workouts from '@/screens/Workouts'
import Workout from '@/screens/Workout'
import EditWorkout from '@/screens/EditWorkout'
import ExerciseSet from '@/screens/ExerciseSet'
import WorkoutHistory from '@/screens/WorkoutHistory'
import Settings from '@/screens/Settings'
import PrivacyPolicy from '@/components/settings/PrivacyPolicy'
import About from '@/components/settings/About'
import DebugData from '@/components/settings/DebugData'
import WeightIncrement from '@/components/settings/WeightIncrement'
import tokens from './styles/tokens'

const Stack = createNativeStackNavigator()

function App() {
  return (
    <NavigationContainer>
      <WorkoutsProvider>
        <Loading>
          <StopwatchProvider>
            <SettingsProvider>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Workouts" component={Workouts} />
                <Stack.Screen name="Workout" component={Workout} />
                <Stack.Screen name="EditWorkout" component={EditWorkout} />
                <Stack.Screen name="WorkoutHistory" component={WorkoutHistory} />
                <Stack.Screen name="ExerciseSet" component={ExerciseSet} />
                <Stack.Screen name="Settings" component={Settings} />
                <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
                <Stack.Screen name="About" component={About} />
                <Stack.Screen name="DebugData" component={DebugData} />
                <Stack.Screen name="WeightIncrement" component={WeightIncrement} />
              </Stack.Navigator>
            </SettingsProvider>
          </StopwatchProvider>
        </Loading>
      </WorkoutsProvider>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  loading: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: tokens.background.primary,
  },
})

const Loading = ({ children }) => {
  const { isLoading } = useWorkoutsContext()
  if (isLoading) {
    return <View style={styles.loading} />
  } else {
    return children
  }
}

export default App
