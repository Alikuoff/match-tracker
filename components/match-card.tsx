"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Match } from "@/lib/api"
import ScoreDisplay from "./score-display"
import TeamLogo from "./team-logo"
import PlayerAvatar from "./player-avatar"

interface MatchCardProps {
  match: Match
}

export default function MatchCard({ match }: MatchCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [prevScore1, setPrevScore1] = useState(match.score1)
  const [prevScore2, setPrevScore2] = useState(match.score2)
  const [score1Changed, setScore1Changed] = useState(false)
  const [score2Changed, setScore2Changed] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (match.score1 !== prevScore1) {
      setScore1Changed(true)
      setPrevScore1(match.score1)

      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        setScore1Changed(false)
      }, 2000)
    }

    if (match.score2 !== prevScore2) {
      setScore2Changed(true)
      setPrevScore2(match.score2)

      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        setScore2Changed(false)
      }, 2000)
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [match.score1, match.score2, prevScore1, prevScore2])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Live":
        return "bg-green-600"
      case "Finished":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  return (
    <div className="rounded-lg bg-gray-900 overflow-hidden border border-gray-800">
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <TeamLogo name={match.team1.name} />
            <span className="font-medium">{match.team1.name}</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-1">
              <ScoreDisplay score={match.score1} isChanged={score1Changed} />
              <span className="text-xl font-bold">:</span>
              <ScoreDisplay score={match.score2} isChanged={score2Changed} />
            </div>
            <span className={cn("text-xs px-3 py-0.5 rounded-full", getStatusColor(match.status))}>{match.status}</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="font-medium">{match.team2.name}</span>
            <TeamLogo name={match.team2.name} />
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center mt-2 text-gray-400 hover:text-white"
        >
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {isExpanded && (
        <div className="bg-gray-950 p-4 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="text-center font-medium text-gray-400 mb-2">Команда 1</h3>
              {match.players1.map((player) => (
                <div key={player.id} className="flex items-center space-x-3">
                  <PlayerAvatar avatar={player.avatar} name={player.name} />
                  <div className="flex-1">
                    <div className="font-medium">{player.name}</div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-gray-400">
                      <div>
                        <span className="text-gray-500">Убийств: </span>
                        <span>{player.kills}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Points: </span>
                        <span className="text-green-500">+{player.points}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Место: </span>
                        <span>{player.position}</span>
                      </div>
                      <div className="col-span-3">
                        <span className="text-gray-500">Всего убийств: </span>
                        <span>{player.totalKills}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-center font-medium text-gray-400 mb-2">Команда 2</h3>
              {match.players2.map((player) => (
                <div key={player.id} className="flex items-center space-x-3">
                  <PlayerAvatar avatar={player.avatar} name={player.name} />
                  <div className="flex-1">
                    <div className="font-medium">{player.name}</div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-gray-400">
                      <div>
                        <span className="text-gray-500">Убийств: </span>
                        <span>{player.kills}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Points: </span>
                        <span className="text-green-500">+{player.points}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Место: </span>
                        <span>{player.position}</span>
                      </div>
                      <div className="col-span-3">
                        <span className="text-gray-500">Всего убийств: </span>
                        <span>{player.totalKills}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

