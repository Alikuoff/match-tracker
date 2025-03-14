import { NextResponse } from "next/server"
import { generateMockMatches } from "@/lib/api"

export async function GET() {
  try {
    // Генерируем тестовые данные для локального API
    const matches = generateMockMatches(8)

    // Добавляем задержку для имитации сетевого запроса
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json(matches)
  } catch (error) {
    console.error("Error in local API route:", error)
    return NextResponse.json({ error: "Ошибка при генерации данных" }, { status: 500 })
  }
}

