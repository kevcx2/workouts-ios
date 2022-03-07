import AsyncStorage from '@react-native-async-storage/async-storage'

const persistence = {
  save: async (key, value) => {
    const serializedValue = JSON.stringify(value)
    await AsyncStorage.setItem(key, serializedValue)
  },

  load: async (key) => {
    const serializedValue = await AsyncStorage.getItem(key)
    const parsedValue = serializedValue ? JSON.parse(serializedValue) : null
    return parsedValue
  },
}

export default persistence
