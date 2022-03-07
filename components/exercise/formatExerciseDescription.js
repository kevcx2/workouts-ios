const formatExerciseDescription = (weight, repsLow, repsHigh) => {
  if (repsLow === repsHigh) {
    return `${weight} / ${repsLow} reps`
  } else {
    return `${weight} / ${repsLow}-${repsHigh} reps`
  }
}

export default formatExerciseDescription
