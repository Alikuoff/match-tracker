import { Suspense } from "react"
import MatchList from "@/components/match-list"
import LoadingState from "@/components/loading-state"

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl font-bold italic mb-6 text-center">Match Tracker</h1>
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 p-4 bg-gray-900 rounded-lg border border-gray-800">
          <h2 className="text-lg font-semibold mb-2">Информация</h2>
          <p className="text-gray-400">
            Приложение отображает информацию о матчах в реальном времени. Если внешний API недоступен или возвращает
            неверный формат данных, приложение автоматически переключается на локальные данные для демонстрации
            функциональности.
          </p>
        </div>
        <Suspense fallback={<LoadingState />}>
          <MatchList />
        </Suspense>
      </div>
    </main>
  )
}

