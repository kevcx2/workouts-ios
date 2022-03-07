import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { Chart, Line, VerticalAxis } from 'react-native-responsive-linechart'

import useExerciseSumamry from '@/components/analytics/useExerciseSummary'
import tokens from '@/styles/tokens'

const styles = StyleSheet.create({
  exerciseChartArea: {
    backgroundColor: tokens.background.secondary,
    padding: tokens.space.base,
    borderRadius: 12,
  },
  exerciseLabelArea: {
    marginBottom: tokens.space.half,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseChartLabel: {
    color: tokens.text.primaryColor,
    fontSize: tokens.text.size.base,
  },
  exerciseChartType: {
    color: tokens.text.secondaryColor,
    fontSize: 12,
    fontWeight: '600',
  },
  exerciseChart: {
    height: 140,
    width: '100%',
  },
  tickLabel: {
    color: tokens.text.secondaryColor,
    fontWeight: '600',
    fontSize: 12,
  },
})

// Define the minimum and maximum elapsed days between two points for display
const MIN_ELAPSED_DAYS = 1
const MAX_ELAPSED_DAYS = 10
// Padding factors for adjusting the minimum and maximum x and y values
const PADDING_FACTOR_SMALL = 0.025
const PADDING_FACTOR_LARGE = 0.1

const getChartDataForExercise = (exerciseSummary, chartType = 'weight') => {
  // Map the raw data into a format that has each day and the total
  // lifted on that day then sort by day
  const totalLiftedOverTime = exerciseSummary
    .map((summary) => ({
      timestamp: summary.timestamp,
      day: Math.floor(summary.timestamp / (60 * 60 * 24)),
      totalLifted: summary.totalLifted,
      weight: summary.weight,
    }))
    .sort((a, b) => a.timestamp - b.timestamp)

  // Initialize an empty chartData array
  const chartData = []

  // Start with the first day as the lastWorkoutDay
  let lastWorkoutDay = totalLiftedOverTime[0].day

  // Traverse the totalLiftedOverTime array
  totalLiftedOverTime.forEach((summary, i) => {
    // For the first workout, x value is hard-coded as 0
    if (i === 0) {
      chartData.push({
        x: 0,
        y: summary[chartType],
      })
    } else {
      // Calculate elapsed time since last workout day
      let elapsedDays = summary.day - lastWorkoutDay

      // Limit elapsedDays to a minimum of MIN_ELAPSED_DAYS and a maximum of MAX_ELAPSED_DAYS
      elapsedDays = Math.max(MIN_ELAPSED_DAYS, elapsedDays)
      elapsedDays = Math.min(MAX_ELAPSED_DAYS, elapsedDays)

      // Add new workout data to chartData
      chartData.push({
        x: chartData[i - 1].x + elapsedDays,
        y: summary[chartType],
      })

      // Update the lastWorkoutDay for next calculation
      lastWorkoutDay = summary.day
    }
  })

  // Calculate xMin and xMax from chartData
  const xMin = Math.min(...chartData.map((dataPoint) => dataPoint.x))
  const xMax = Math.max(...chartData.map((dataPoint) => dataPoint.x))
  // Calculate the range of x values
  let xRange = xMax - xMin
  // Apply padding to xMin and xMax
  const chartXMin = xMin - xRange * PADDING_FACTOR_SMALL - 0.2
  const chartXMax = xMax + xRange * PADDING_FACTOR_SMALL

  // Similarly, calculate yMin and yMax from chartData
  const yMin = Math.min(...chartData.map((dataPoint) => dataPoint.y))
  const yMax = Math.max(...chartData.map((dataPoint) => dataPoint.y))
  // Calculate the range of y values
  let yRange = yMax - yMin
  if (yRange === 0) yRange = 1
  // Apply different padding factors to yMin and yMax.
  // The top of the chart (yMax) has a larger padding factor.
  const chartYMin = yMin - yRange * PADDING_FACTOR_SMALL
  const chartYMax = yMax + yRange * PADDING_FACTOR_LARGE

  return {
    data: chartData,
    xMin,
    xMax,
    yMin,
    yMax,
    chartXMin,
    chartXMax,
    chartYMin,
    chartYMax,
  }
}

const ExerciseChart = ({ exercise, chartType, title }) => {
  const summaryData = useExerciseSumamry(exercise)
  if (summaryData.length === 0) {
    return null
  }
  const chartData = getChartDataForExercise(summaryData, chartType)
  return (
    <View style={styles.exerciseChartArea}>
      <View style={styles.exerciseLabelArea}>
        {title && <Text style={styles.exerciseChartLabel}>{exercise.name}</Text>}
        <Text style={styles.exerciseChartType}>
          {chartType === 'weight' ? 'WEIGHT' : 'TOTAL LIFTED'}
        </Text>
      </View>
      <Chart
        style={styles.exerciseChart}
        padding={{
          left: 40,
          right: tokens.space.half,
          bottom: tokens.space.half,
          top: tokens.space.half,
        }}
        disableTouch
        disableGestures
        data={chartData.data}
        xDomain={{ min: chartData.chartXMin, max: chartData.chartXMax }}
        yDomain={{ min: chartData.chartYMin, max: chartData.chartYMax }}
      >
        <Line
          smoothing={'cubic-spline'}
          theme={{
            stroke: { color: '#057aff', width: 5 },
            scatter: { default: { width: 0, height: 0 } },
          }}
        />
        <VerticalAxis
          tickValues={
            chartData.yMin === chartData.yMax
              ? [chartData.yMin]
              : [chartData.yMin, chartData.yMax]
          }
          theme={{
            axis: {
              visible: false,
            },
            ticks: {
              visible: false,
            },
            labels: {
              visible: true,
              label: {
                ...styles.tickLabel,
              },
            },
            grid: {
              visible: false,
            },
          }}
        />
      </Chart>
    </View>
  )
}

export default ExerciseChart
