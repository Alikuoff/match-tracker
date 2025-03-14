"use client"

import { createContext, useContext, type ReactNode, useState, useEffect } from "react"
import { useWebSocket } from "@/hooks/use-websocket"
import { getWebSocketUrl, type Match } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface WebSocketContextType {
  isConnected: boolean
  lastUpdate: Match | null
  allMatches: Match[] | null
}

const WebSocketContext = createContext<WebSocketContextType>({
  isConnected: false,
  lastUpdate: null,
  allMatches: null,
})

export const useMatchWebSocket = () => useContext(WebSocketContext)

interface WebSocketProviderProps {
  children: ReactNode
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const [lastUpdate, setLastUpdate] = useState<Match | null>(null)
  const [allMatches, setAllMatches] = useState<Match[] | null>(null)
  const { toast } = useToast()

  const { isConnected, lastMessage, error } = useWebSocket(getWebSocketUrl(), {
    onOpen: () => {
      toast({
        title: "Соединение установлено",
        description: "Обновления матчей будут приходить в реальном времени",
        duration: 3000,
      })
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Ошибка WebSocket",
        description: "Не удалось установить соединение для обновлений в реальном времени.",
      })
    },
  })

  useEffect(() => {
    if (lastMessage) {
      if (Array.isArray(lastMessage)) {
        setAllMatches(lastMessage)
      } else if (lastMessage.type === "update" && lastMessage.match) {
        setLastUpdate(lastMessage.match)
      }
    }
  }, [lastMessage])

  return (
    <WebSocketContext.Provider value={{ isConnected, lastUpdate, allMatches }}>{children}</WebSocketContext.Provider>
  )
}

