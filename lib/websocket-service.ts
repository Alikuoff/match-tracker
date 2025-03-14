type WebSocketCallback = (data: any) => void

class WebSocketService {
  private ws: WebSocket | null = null
  private url: string
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectTimeout = 3000
  private callbacks: WebSocketCallback[] = []

  constructor(url: string) {
    this.url = url
  }

  public connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) return

    this.ws = new WebSocket(this.url)

    this.ws.onopen = () => {
      console.log("WebSocket connected")
      this.reconnectAttempts = 0
    }

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        this.notifyCallbacks(data)
      } catch (error) {
        console.error("Error parsing WebSocket message:", error)
      }
    }

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error)
    }

    this.ws.onclose = () => {
      console.log("WebSocket disconnected")
      this.attemptReconnect()
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`)

      setTimeout(() => {
        this.connect()
      }, this.reconnectTimeout)
    } else {
      console.log("Max reconnect attempts reached. Giving up.")
    }
  }

  public subscribe(callback: WebSocketCallback): () => void {
    this.callbacks.push(callback)

    return () => {
      this.callbacks = this.callbacks.filter((cb) => cb !== callback)
    }
  }

  private notifyCallbacks(data: any): void {
    this.callbacks.forEach((callback) => {
      callback(data)
    })
  }

  public disconnect(): void {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }
}

export default WebSocketService

