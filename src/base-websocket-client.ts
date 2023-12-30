import { TypedEventEmitter } from '@khangdt22/utils/event'
import { WebsocketClient as Client } from '@khangdt22/utils/ws'
import { isNull } from '@khangdt22/utils/condition'
import { isKeyOf, isObject } from '@khangdt22/utils/object'
import { unique, difference, chunk, intersection } from '@khangdt22/utils/array'
import type { WebsocketClientEvents, WebsocketClientOptions, Method, MethodArgs, MethodReturnType } from './types'
import { type Market, baseTestnetUrls, baseUrls, maxStreamsPerConnection } from './constants'
import { WebsocketStore, chunkStreams } from './utils'
import { WebsocketClientError } from './errors'

export class BaseWebsocketClient extends TypedEventEmitter<WebsocketClientEvents> {
    protected readonly baseUrl: string
    protected readonly store: WebsocketStore
    protected readonly requestTimeout: number
    protected readonly maxPayload: number
    protected readonly maxStreamsPerConnection: number

    public constructor(public readonly market: Market, protected readonly options: WebsocketClientOptions = {}) {
        super()

        const { baseUrl, testnet = false, requestTimeout = 10_000, maxPayload = 8192 } = options

        this.baseUrl = baseUrl ?? (testnet ? baseTestnetUrls[market] : baseUrls[market])
        this.requestTimeout = requestTimeout
        this.maxPayload = maxPayload
        this.maxStreamsPerConnection = options.maxStreamsPerConnection ?? maxStreamsPerConnection[market]
        this.store = new WebsocketStore()
    }

    public async subscribe(streams: string[]) {
        const subscribeStreams = unique(difference(streams, this.store.allStreams()))
        const limit = this.maxStreamsPerConnection

        // Reusing existing connections if it's not full.
        for (const id of this.store.ids()) {
            const streamsCount = this.store.streamsCount(id)

            if (this.store.isConnected(id) && streamsCount < limit) {
                await this.sendSubscribeOrUnsubscribe(id, 'SUBSCRIBE', subscribeStreams.splice(0, limit - streamsCount))

                if (subscribeStreams.length === 0) {
                    return () => this.unsubscribe(streams)
                }
            }
        }

        // Creating a new connection if all existing connections are full.
        for (const streamsChunk of chunk(subscribeStreams, limit)) {
            await this.connect().then((id) => this.sendSubscribeOrUnsubscribe(id, 'SUBSCRIBE', streamsChunk))
        }

        return () => this.unsubscribe(streams)
    }

    public async unsubscribe(streams: string[]) {
        for (const id of this.store.ids()) {
            await this.sendSubscribeOrUnsubscribe(id, 'UNSUBSCRIBE', intersection(streams, this.store.getStreams(id)))
        }
    }

    public async close() {
        await Promise.all(this.store.ids().map((id) => this.disconnect(id)))
    }

    protected async sendSubscribeOrUnsubscribe(id: number, method: 'SUBSCRIBE' | 'UNSUBSCRIBE', streams: string[]) {
        if (streams.length === 0) {
            return
        }

        for (const subscribeStreams of chunkStreams(streams, this.maxPayload, this.store.currentRequestId())) {
            await this.send(id, method, subscribeStreams)
        }
    }

    protected async send<M extends Method>(id: number, method: M, ...args: MethodArgs[M]) {
        const client = this.store.getClient(id)
        const context = this.store.get(id)
        const request = this.store.createRequest(id, method, args[0], this.requestTimeout)

        this.emit('request', request.payload, id, context)

        await client.send(JSON.stringify(request.payload)).catch((error) => {
            throw this.store.createRequestError(id, request.payload, 'Send request failed', { cause: error })
        })

        const response = await this.store.getRequestResponse(id, request)

        if (method === 'SUBSCRIBE' && isNull(response)) {
            this.store.addStream(id, args[0] as string[])
        }

        if (method === 'UNSUBSCRIBE' && isNull(response)) {
            this.store.removeStream(id, args[0] as string[])
        }

        this.emit('response', response, request.payload, id, context)

        return response as MethodReturnType[M]
    }

    protected async connect() {
        const client = new Client(new URL('/stream', this.baseUrl).href, this.getClientOptions())
        const id = this.store.create(client)
        const context = this.store.get(id)

        for (const event of <const>['connect', 'connected', 'reconnect', 'disconnect']) {
            client.on(event, () => this.emit(event, id, context))
        }

        client.on('close', this.emit.bind(this, 'close', id, context))
        client.on('reconnected', this.onReconnected.bind(this, id))
        client.on('disconnected', this.onDisconnected.bind(this, id))
        client.on('message', this.onMessage.bind(this, id))

        await client.connect()

        return id
    }

    protected async disconnect(id: number) {
        await this.store.get(id)?.client.disconnect()
    }

    protected onReconnected(id: number) {
        this.sendSubscribeOrUnsubscribe(id, 'SUBSCRIBE', this.store.getStreams(id)).then(() => {
            this.emit('reconnected', id, this.store.get(id))
        })
    }

    protected onDisconnected(id: number) {
        this.emit('disconnected', id, this.store.get(id))
        this.store.remove(id)
    }

    protected async onMessage(id: number, message: string) {
        const data = this.parseMessage(message, id)
        const context = this.store.get(id)

        if (this.store.hasRequest(id, data.id)) {
            return this.store.resolveRequest(id, data.id, data)
        }

        this.emit('message', data, id, context)

        if (isObject(data) && isKeyOf(data, 'stream')) {
            this.emit('stream', data.stream, data.data, id, context)
        }
    }

    protected parseMessage(message: string, id: number) {
        try {
            return JSON.parse(message)
        } catch (error) {
            throw new WebsocketClientError(id, this.store.get(id), `Failed to parse message: ${message}`, { cause: error })
        }
    }

    protected getClientOptions() {
        return {
            ...this.options,
            autoConnect: false,
            autoPongMessage: (data?: Buffer) => data,
            requestTimeout: this.requestTimeout,
        }
    }
}
