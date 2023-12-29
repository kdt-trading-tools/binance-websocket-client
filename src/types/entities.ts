import { WebsocketClient } from '@khangdt22/utils/ws'
import type { DeferredPromise } from './utils'

export interface WebsocketStoreItem {
    client: WebsocketClient
    streams: Set<string>
    requests: Record<number, DeferredPromise<any>>
}

export interface ErrorResponse {
    id: string
    error: {
        code: number
        msg: string
    }
}
