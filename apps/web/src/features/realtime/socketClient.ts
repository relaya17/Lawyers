import { io, Socket } from 'socket.io-client'
import type { ClientToServerEvents, ServerToClientEvents } from './types'

export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>

let socketInstance: AppSocket | null = null

function resolveSocketUrl(): string {
  const explicit = import.meta.env.VITE_SOCKET_URL
  if (explicit) return explicit
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
  return apiUrl.replace(/\/api\/?$/, '')
}

/**
 * Lazily creates (or reuses) the singleton Socket.io client.
 * The access token is resolved each connection attempt so refreshed
 * tokens are used automatically after reconnects.
 */
export function getSocket(getToken: () => string | null | undefined): AppSocket {
  if (socketInstance && socketInstance.connected) return socketInstance
  if (!socketInstance) {
    socketInstance = io(resolveSocketUrl(), {
      path: '/socket.io',
      transports: ['websocket'],
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
      timeout: 10000,
      withCredentials: true,
      auth: (cb) => cb({ token: getToken() ?? '' }),
    })
  }
  if (!socketInstance.connected) socketInstance.connect()
  return socketInstance
}

export function disconnectSocket(): void {
  if (socketInstance) {
    socketInstance.removeAllListeners()
    socketInstance.disconnect()
    socketInstance = null
  }
}
