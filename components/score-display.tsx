"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface ScoreDisplayProps {
  score: number
  isChanged: boolean
}

export default function ScoreDisplay({ score, isChanged }: ScoreDisplayProps) {
  const [displayScore, setDisplayScore] = useState(score)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    if (isChanged && score > displayScore) {
      setAnimating(true)

      // Animate score counting up
      let currentScore = displayScore
      const targetScore = score
      const increment = 1
      const duration = 1000 // ms
      const steps = targetScore - currentScore
      const interval = duration / steps

      const timer = setInterval(() => {
        currentScore += increment
        setDisplayScore(currentScore)

        if (currentScore >= targetScore) {
          clearInterval(timer)
          setAnimating(false)
        }
      }, interval)

      return () => clearInterval(timer)
    } else {
      setDisplayScore(score)
    }
  }, [score, isChanged, displayScore])

  return (
    <span
      className={cn(
        "text-xl font-bold transition-all duration-300",
        isChanged && "text-green-500 scale-125",
        animating && "animate-pulse",
      )}
    >
      {displayScore}
    </span>
  )
}

