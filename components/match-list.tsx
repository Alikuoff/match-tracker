"use client"

import { useState, useEffect, useRef } from "react"
import { RefreshCw, AlertTriangle, Wifi, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import MatchCard from "./match-card"
import { useToast } from "@/hooks/use-toast"
import StatusFilter from "./status-filter"
import { fetchMatches, getMockDataUpdater, getWebSocketUrl, type Match } from "@/lib/api"

export default function MatchList() {
  const [matches, setMatches] = useState<Match[]>([])
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string>("Все статусы")
  const [usingMockData, setUsingMockData] = useState(false)
  const [wsConnected, setWsConnected] = useState(false)
  const { toast } = useToast()
  const unsubscribeRef = useRef<(() => void) | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Загрузка матчей
  const loadMatches = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await fetchMatches()
      setMatches(data)
      applyFilter(selectedStatus, data)

      toast({
        title: "Данные загружены",
        description: `Успешно загружено ${data.length} матчей`,
        duration: 3000,
      })

      // Проверяем, используются ли тестовые данные
      if (data.length > 0 && data[0].id.startsWith("match-")) {
        setUsingMockData(true)
        setupMockUpdates()
      } else {
        setUsingMockData(false)
        cleanupMockUpdates()
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Ошибка: не удалось загрузить информацию."
      console.error("Error loading matches:", err)
      setError(errorMessage)

      toast({
        variant: "destructive",
        title: "Ошибка загрузки данных",
        description: errorMessage,
      })

      // При ошибке используем тестовые данные
      const mockData = getMockDataUpdater().getMatches()
      setMatches(mockData)
      applyFilter(selectedStatus, mockData)
      setUsingMockData(true)
      setupMockUpdates()
    } finally {
      setIsLoading(false)
    }
  }

  // Настройка имитации обновлений для тестовых данных
  const setupMockUpdates = () => {
    // Отписываемся от предыдущих обновлений, если они были
    cleanupMockUpdates()

    // Подписываемся на обновления
    unsubscribeRef.current = getMockDataUpdater().subscribe((newMatches) => {
      console.log("Mock data updated")
      setMatches(newMatches)
      applyFilter(selectedStatus, newMatches)
    })

    console.log("Mock updates started")
  }

  // Очистка подписки на обновления тестовых данных
  const cleanupMockUpdates = () => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current()
      unsubscribeRef.current = null
    }
  }

  // Подключение к WebSocket для обновлений в реальном времени
  const connectWebSocket = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return

    try {
      const wsUrl = getWebSocketUrl()
      console.log(`Connecting to WebSocket: ${wsUrl}`)

      const ws = new WebSocket(wsUrl)

      ws.onopen = () => {
        console.log("WebSocket connected")
        setWsConnected(true)

        toast({
          title: "WebSocket подключен",
          description: "Обновления матчей будут приходить в реальном времени",
          duration: 3000,
        })
      }

      ws.onmessage = (event) => {
        try {
          console.log("WebSocket message received")
          const data = JSON.parse(event.data)

          if (Array.isArray(data)) {
            console.log(`Received array of ${data.length} matches`)
            setMatches(data)
            applyFilter(selectedStatus, data)
          } else if (data.type === "update" && data.match) {
            console.log(`Received update for match: ${data.match.id}`)
            updateMatch(data.match)
          } else {
            console.log("Received other data:", data)
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error)
        }
      }

      ws.onerror = (error) => {
        console.error("WebSocket error:", error)
        setWsConnected(false)

        toast({
          variant: "destructive",
          title: "Ошибка WebSocket",
          description: "Не удалось установить соединение для обновлений в реальном времени",
        })
      }

      ws.onclose = (event) => {
        console.log(`WebSocket disconnected with code: ${event.code}, reason: ${event.reason}`)
        setWsConnected(false)

        // Attempt to reconnect after 5 seconds
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current)
        }

        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket()
        }, 5000)
      }

      wsRef.current = ws
    } catch (error) {
      console.error("Failed to connect to WebSocket:", error)
      setWsConnected(false)
    }
  }

  const updateMatch = (updatedMatch: Match) => {
    setMatches((prevMatches) => {
      const newMatches = prevMatches.map((match) => (match.id === updatedMatch.id ? updatedMatch : match))
      applyFilter(selectedStatus, newMatches)
      return newMatches
    })
  }

  const applyFilter = (status: string, matchList: Match[]) => {
    if (status === "Все статусы") {
      setFilteredMatches(matchList)
    } else {
      setFilteredMatches(matchList.filter((match) => match.status === status))
    }
  }

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status)
    applyFilter(status, matches)
  }

  // Принудительное обновление данных
  const forceUpdate = () => {
    if (usingMockData) {
      getMockDataUpdater().forceUpdate()
    } else {
      loadMatches()
    }
  }

  useEffect(() => {
    loadMatches()
    connectWebSocket()

    return () => {
      cleanupMockUpdates()

      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
      }

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
        reconnectTimeoutRef.current = null
      }
    }
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
        <StatusFilter selectedStatus={selectedStatus} onStatusChange={handleStatusChange} />

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            onClick={forceUpdate}
            disabled={isLoading}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Обновить
          </Button>

          <div className="flex items-center justify-center px-3 py-1 bg-gray-800 rounded-md">
            {wsConnected ? (
              <div className="flex items-center text-green-500">
                <Wifi className="h-4 w-4 mr-1" />
                <span className="text-xs">Онлайн</span>
              </div>
            ) : (
              <div className="flex items-center text-gray-500">
                <WifiOff className="h-4 w-4 mr-1" />
                <span className="text-xs">Оффлайн</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {usingMockData && (
        <div className="p-4 bg-amber-900/30 border border-amber-700 rounded-md flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
          <div>
            <p className="font-medium text-amber-500">Используются тестовые данные</p>
            <p className="text-sm text-gray-400">
              API вернул неверный формат данных или недоступен. Используются локальные данные для демонстрации.
            </p>
          </div>
        </div>
      )}

      {error && <div className="p-4 bg-red-900/30 border border-red-700 rounded-md text-center">{error}</div>}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMatches.length === 0 ? (
            <p className="text-center py-8 text-gray-400">Нет доступных матчей</p>
          ) : (
            filteredMatches.map((match) => <MatchCard key={match.id} match={match} />)
          )}
        </div>
      )}
    </div>
  )
}

