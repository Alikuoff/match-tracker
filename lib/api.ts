export interface Team {
  id: string
  name: string
  logo?: string
}

export interface Player {
  id: string
  name: string
  avatar: string
  kills: number
  points: number
  position: number
  totalKills: number
}

export interface Match {
  id: string
  team1: Team
  team2: Team
  score1: number
  score2: number
  status: "Live" | "Finished" | "Match preparing"
  players1: Player[]
  players2: Player[]
}

// Используем только локальный API, так как внешний API возвращает HTML вместо JSON
const API_BASE_URL = "/api"

// WebSocket URL для обновлений в реальном времени
const WEBSOCKET_URL = "wss://app.ftoyd.com/fronttemp-service/ws"

/**
 * Загружает матчи с API
 */
export async function fetchMatches(): Promise<Match[]> {
  try {
    console.log(`Fetching matches from: ${API_BASE_URL}/matches`)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    const response = await fetch(`${API_BASE_URL}/matches`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      cache: "no-store",
    }).finally(() => clearTimeout(timeoutId))

    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}: не удалось загрузить информацию.`)
    }

    // Проверяем тип контента перед парсингом
    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      console.warn(`API returned non-JSON content type: ${contentType}`)
      console.log("Falling back to local data")
      return generateMockMatches(8)
    }

    const data = await response.json()

    if (Array.isArray(data)) {
      return data
    } else if (data && typeof data === "object") {
      if (Array.isArray(data.matches)) return data.matches
      if (Array.isArray(data.data)) return data.data
      if (Array.isArray(data.results)) return data.results
    }

    console.warn("API returned unexpected data format, using mock data")
    return generateMockMatches(8)
  } catch (error) {
    console.error("Error fetching matches:", error)
    console.log("Falling back to local data due to error")
    return generateMockMatches(8)
  }
}

/**
 * Загружает детали матча по ID
 */
export async function fetchMatchDetails(matchId: string): Promise<Match> {
  try {
    const url = `${API_BASE_URL}/matches/${matchId}`
    console.log(`Fetching match details from: ${url}`)

    const response = await fetch(url, { cache: "no-store" })

    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}: не удалось загрузить информацию о матче.`)
    }

    // Проверяем тип контента перед парсингом
    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      console.warn(`API returned non-JSON content type: ${contentType}`)
      throw new Error("API вернул неверный формат данных.")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Error fetching match details:`, error)
    throw error instanceof Error ? error : new Error("Ошибка при загрузке информации о матче.")
  }
}

/**
 * Возвращает URL для WebSocket соединения
 */
export function getWebSocketUrl(): string {
  return WEBSOCKET_URL
}

// Генерирует тестовые данные для локального API
export function generateMockMatches(count = 5): Match[] {
  const statuses = ["Live", "Finished", "Match preparing"]
  const matches: Match[] = []

  for (let i = 0; i < count; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)] as "Live" | "Finished" | "Match preparing"
    const score1 = status === "Match preparing" ? 0 : Math.floor(Math.random() * 5)
    const score2 = status === "Match preparing" ? 0 : Math.floor(Math.random() * 5)

    const players1 = Array(3)
      .fill(0)
      .map((_, j) => ({
        id: `team1-player-${j}`,
        name: `Player ${j + 1}`,
        avatar: "",
        kills: Math.floor(Math.random() * 10),
        points: Math.floor(Math.random() * 50),
        position: j + 1,
        totalKills: Math.floor(Math.random() * 20),
      }))

    const players2 = Array(3)
      .fill(0)
      .map((_, j) => ({
        id: `team2-player-${j}`,
        name: `Player ${j + 4}`,
        avatar: "",
        kills: Math.floor(Math.random() * 10),
        points: Math.floor(Math.random() * 50),
        position: j + 1,
        totalKills: Math.floor(Math.random() * 20),
      }))

    matches.push({
      id: `match-${i}`,
      team1: {
        id: `team1-${i}`,
        name: `Command №1`,
      },
      team2: {
        id: `team2-${i}`,
        name: `Command №2`,
      },
      score1,
      score2,
      status,
      players1,
      players2,
    })
  }

  return matches
}

// Функция для имитации обновления данных в реальном времени
export function createMockDataUpdater() {
  let matches = generateMockMatches(8)
  let subscribers: ((matches: Match[]) => void)[] = []
  let intervalId: NodeJS.Timeout | null = null

  // Обновляет счет и статус случайного матча
  const updateRandomMatch = () => {
    const matchIndex = Math.floor(Math.random() * matches.length)
    const match = { ...matches[matchIndex] }

    // Обновляем счет с 50% вероятностью
    if (Math.random() > 0.5) {
      if (match.status === "Live") {
        if (Math.random() > 0.5) {
          match.score1 += 1
        } else {
          match.score2 += 1
        }
      }
    }

    // Обновляем статус с 20% вероятностью
    if (Math.random() > 0.8) {
      const statuses: ("Live" | "Finished" | "Match preparing")[] = ["Live", "Finished", "Match preparing"]
      const currentIndex = statuses.indexOf(match.status)
      const nextIndex = (currentIndex + 1) % statuses.length
      match.status = statuses[nextIndex]
    }

    // Обновляем статистику игроков
    match.players1 = match.players1.map((player) => ({
      ...player,
      kills: Math.random() > 0.7 ? player.kills + 1 : player.kills,
      points: Math.random() > 0.7 ? player.points + 5 : player.points,
    }))

    match.players2 = match.players2.map((player) => ({
      ...player,
      kills: Math.random() > 0.7 ? player.kills + 1 : player.kills,
      points: Math.random() > 0.7 ? player.points + 5 : player.points,
    }))

    // Обновляем матч в списке
    matches = [...matches.slice(0, matchIndex), match, ...matches.slice(matchIndex + 1)]

    // Уведомляем подписчиков
    subscribers.forEach((callback) => callback(matches))
  }

  return {
    // Подписка на обновления
    subscribe: (callback: (matches: Match[]) => void) => {
      subscribers.push(callback)

      // Сразу отправляем текущие данные
      callback(matches)

      // Запускаем интервал обновления, если еще не запущен
      if (!intervalId) {
        intervalId = setInterval(updateRandomMatch, 5000)
      }

      // Возвращаем функцию отписки
      return () => {
        subscribers = subscribers.filter((cb) => cb !== callback)

        // Если больше нет подписчиков, останавливаем интервал
        if (subscribers.length === 0 && intervalId) {
          clearInterval(intervalId)
          intervalId = null
        }
      }
    },

    // Получение текущих данных
    getMatches: () => matches,

    // Принудительное обновление
    forceUpdate: () => {
      matches = generateMockMatches(8)
      subscribers.forEach((callback) => callback(matches))
    },
  }
}

// Создаем синглтон для имитации данных
let mockDataUpdater: ReturnType<typeof createMockDataUpdater> | null = null

export function getMockDataUpdater() {
  if (!mockDataUpdater) {
    mockDataUpdater = createMockDataUpdater()
  }
  return mockDataUpdater
}

