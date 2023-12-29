import type { WebsocketStoreItem } from '../types'

export class WebsocketClientError extends Error {
    public readonly clientId: number
    public readonly clientAddress: string
    public readonly clientStreams: string[]

    public constructor(clientId: number, clientContext: WebsocketStoreItem, message?: string, options?: ErrorOptions) {
        super(message, options)

        this.clientId = clientId
        this.clientAddress = clientContext.client.address
        this.clientStreams = [...clientContext.streams]
    }
}
