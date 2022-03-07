const getDateDaysAgo = (daysAgo) => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toString()
}

let seedId = 0
const incrementId = () => {
  seedId += 1
  return seedId
}

const createExercise = (name, weightStart) => {
  let currentWeight = weightStart
  const history = Array.from({ length: 7 }, (_, i) => {
    if (Math.random() > 0.5) currentWeight += 5
    return {
      id: incrementId(),
      name,
      weight: currentWeight,
      repsLow: 5,
      repsHigh: 5,
      numSets: 5,
      completedSets: Array.from({ length: 5 }, () => ({ reps: 5 })),
      completedAt: getDateDaysAgo((6 - i) * 3),
    }
  })

  return {
    id: incrementId(),
    name,
    weight: currentWeight,
    repsLow: 5,
    repsHigh: 5,
    numSets: 5,
    completedSets: [],
    history: history,
  }
}

export const workouts = [
  {
    id: incrementId(),
    name: '5x5 Upper Body',
    lastCompletedAt: getDateDaysAgo(3),
    exercises: [
      createExercise('DB Bench', 135),
      createExercise('Pull up', 30),
      createExercise('Curl', 55),
      createExercise('Pushup', 50),
      createExercise('Overhead Press', 90),
    ],
  },
  {
    id: incrementId(),
    name: '4x5 Lower Body',
    lastCompletedAt: getDateDaysAgo(2),
    exercises: [
      createExercise('Squat', 185),
      createExercise('Deadlift', 220),
      createExercise('Leg Press', 360),
      createExercise('Lunge', 150),
    ],
  },
]
