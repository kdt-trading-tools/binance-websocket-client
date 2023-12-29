import type { WebsocketStoreItem } from './entities'

export type WebsocketClientEvents = {
    'connect': (id: number, client: WebsocketStoreItem) => void
    'connected': (id: number, client: WebsocketStoreItem) => void
    'reconnect': (id: number, client: WebsocketStoreItem) => void
    'reconnected': (id: number, client: WebsocketStoreItem) => void
    'disconnect': (id: number, client: WebsocketStoreItem) => void
    'disconnected': (id: number, client: WebsocketStoreItem) => void
    'close': (id: number, client: WebsocketStoreItem, code?: number, reason?: string, rawReason?: Buffer) => void
    'request': (payload: any, clientId: number, client: WebsocketStoreItem) => void
    'response': (response: any, requestPayload: any, clientId: number, client: WebsocketStoreItem) => void
    'message': (data: any, clientId: number, client: WebsocketStoreItem) => void
    'stream': (stream: string, data: any, clientId: number, client: WebsocketStoreItem) => void
}
