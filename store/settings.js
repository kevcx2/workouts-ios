import { useState, useEffect } from 'react'
import constate from 'constate'
import persistence from './persistence'

// Global settings state
// Stores the weight picker incrementWeightBy value (defaults to 2.5). Some lifters
// only have 5lb plates, some have 2.5, some have micro-plates.

const SETTINGS_STORE_KEY = '@settings'

const useSettings = () => {
  const [incrementWeightBy, setIncrementWeightBy] = useState(2.5)

  useEffect(() => {
    async function load() {
      let savedState = await persistence.load(SETTINGS_STORE_KEY)
      if (savedState) setIncrementWeightBy(savedState.incrementWeightBy)
    }
    load()
  }, [])

  return {
    incrementWeightBy,
    setIncrementWeightBy: (incrementBy) => {
      setIncrementWeightBy(incrementBy)
      persistence.save(SETTINGS_STORE_KEY, { incrementWeightBy: incrementBy })
    },
  }
}

export const [SettingsProvider, useSettingsContext] = constate(useSettings)
