import type { WebsocketClientOptions as BaseOptions } from '@khangdt22/utils/ws'

export interface WebsocketClientOptions extends Omit<BaseOptions, 'autoConnect' | 'autoPongMessage'> {
    baseUrl?: string
    testnet?: boolean
    maxPayload?: number
    maxStreamsPerConnection?: number
}
