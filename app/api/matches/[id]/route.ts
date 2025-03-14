import { NextResponse } from "next/server"
import { generateMockMatches } from "@/lib/api"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const matchId = params.id

    // Генерируем тестовые данные и находим матч по ID
    const matches = generateMockMatches(8)
    const match = matches.find((m) => m.id === matchId)

    if (!match) {
      return NextResponse.json({ error: "Матч не найден" }, { status: 404 })
    }

    // Добавляем задержку для имитации сетевого запроса
    await new Promise((resolve) => setTimeout(resolve, 300))

    return NextResponse.json(match)
  } catch (error) {
    console.error("Error in match details API route:", error)
    return NextResponse.json({ error: "Ошибка при получении информации о матче" }, { status: 500 })
  }
}

