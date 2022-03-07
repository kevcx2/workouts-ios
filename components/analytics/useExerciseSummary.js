const useExerciseSummary = (exercise) => {
  const analysis = []

  exercise.history.forEach((completedExercise) => {
    const { completedAt, weight, repsLow, repsHigh } = completedExercise
    const totalReps = completedExercise.completedSets.reduce(
      (total, current) => total + current.reps,
      0,
    )
    analysis.push({
      date: completedAt,
      timestamp: Math.floor(new Date(completedAt).getTime() / 1000),
      weight: weight,
      repsLow: repsLow,
      repsHigh: repsHigh,
      totalLifted: totalReps * completedExercise.weight,
      totalReps,
    })
  })

  return analysis
}

export default useExerciseSummary
