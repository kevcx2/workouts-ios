import { useState, useEffect } from 'react'
import { useTimer } from 'react-use-precision-timer'
import constate from 'constate'

import persistence from './persistence'

const formatMilliseconds = (milliseconds) => {
  if (typeof milliseconds !== 'number' || milliseconds < 0) {
    return {
      minutes: '00',
      seconds: '00',
      deciseconds: 0,
    }
  }

  const totalSeconds = Math.floor(milliseconds / 1000)
  const minutes = Math.min(Math.floor(totalSeconds / 60), 59)
  const seconds = Math.min(totalSeconds % 60, 59)
  const deciseconds = Math.min(Math.floor((milliseconds % 1000) / 100), 9)

  // Add leading zeros to minutes and seconds if they are single digits
  const formattedMinutes = String(minutes).padStart(2, '0')
  const formattedSeconds = String(seconds).padStart(2, '0')

  return {
    minutes: formattedMinutes,
    seconds: formattedSeconds,
    deciseconds,
  }
}

const STOPWATCH_STORE_KEY = '@stopwatch'

const useStopwatch = () => {
  const stopwatch = useTimer()
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isShowing, setIsShowing] = useState(true)

  useEffect(() => {
    async function load() {
      let savedState = await persistence.load(STOPWATCH_STORE_KEY)
      setIsShowing(savedState?.isShowing)
    }
    load()
  }, [])

  const start = () => {
    stopwatch.start()
  }

  const stop = () => {
    stopwatch.pause()
  }

  const toggle = () => {
    if (stopwatch.isRunning()) {
      stopwatch.pause()
    } else if (stopwatch.isPaused()) {
      stopwatch.resume()
    } else if (!stopwatch.isStarted()) {
      stopwatch.start()
    }
  }

  const reset = () => {
    // If currently running, keep running after reset
    if (stopwatch.isRunning()) {
      stopwatch.start()
    } else {
      // If not currently running, stay paused after reset
      stopwatch.start()
      stopwatch.pause()
    }
  }

  // Update the stopwatch every decisecond
  useEffect(() => {
    let interval

    interval = setInterval(() => {
      setElapsedTime(stopwatch.getElapsedRunningTime())
    }, 100)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    milliseconds: elapsedTime,
    formattedTime: formatMilliseconds(elapsedTime),
    start,
    stop,
    toggle,
    reset,
    isShowing,
    show: () => {
      setIsShowing(true)
      persistence.save(STOPWATCH_STORE_KEY, { isShowing: true })
    },
    hide: () => {
      setIsShowing(false)
      persistence.save(STOPWATCH_STORE_KEY, { isShowing: false })
    },
  }
}

export const [StopwatchProvider, useStopwatchContext] = constate(useStopwatch)
