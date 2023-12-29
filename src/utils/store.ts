import { type WebsocketClient, WebsocketClientState } from '@khangdt22/utils/ws'
import { wrap, unique } from '@khangdt22/utils/array'
import { createDeferred, withTimeout } from '@khangdt22/utils/promise'
import { filterByValue, isKeyOf } from '@khangdt22/utils/object'
import { notUndefined } from '@khangdt22/utils/condition'
import type { WebsocketStoreItem } from '../types'
import { WebsocketRequestError } from '../errors'
import { isErrorResponse } from './requests'

export class WebsocketStore {
    protected readonly items: Record<number, WebsocketStoreItem> = {}

    protected id = 0
    protected requestId = 0

    public getClient(id: number) {
        if (!this.items[id]) {
            throw new Error(`Client ${id} does not exist`)
        }

        if (!this.isConnected(id)) {
            throw new Error(`Client ${id} is not ready`)
        }

        return this.items[id].client
    }

    public isConnected(id: number) {
        return this.items[id]?.client.state === WebsocketClientState.CONNECTED
    }

    public get(id: number) {
        return this.items[id]
    }

    public all() {
        return this.items
    }

    public ids() {
        return Object.keys(this.all()).map(Number)
    }

    public create(client: WebsocketClient) {
        const id = ++this.id

        this.items[id] = {
            client, streams: new Set<string>(), requests: {},
        }

        return id
    }

    public remove(id: number) {
        this.items[id].client.removeAllListeners(undefined as any)
        delete this.items[id]
    }

    public hasRequest(id: number, requestId: number) {
        return !!this.items[id]?.requests[requestId]
    }

    public currentRequestId() {
        return this.requestId
    }

    public resolveRequest(id: number, requestId: number, response: any) {
        this.items[id]?.requests[requestId]?.resolve(response)
    }

    public createRequest(id: number, method: string, params?: any[], timeout?: number) {
        const requestId = ++this.requestId
        const payload = filterByValue({ id: requestId, method, params }, notUndefined)
        const request = this.items[id].requests[requestId] = createDeferred()

        if (timeout) {
            return Object.assign(withTimeout(request, timeout, this.createRequestError(id, payload, 'Request timeout')), {
                id: requestId,
                payload,
            })
        }

        return Object.assign(request, { id: requestId, payload })
    }

    public removeRequest(id: number, requestId: number) {
        delete this.items[id].requests[requestId]
    }

    public async getRequestResponse(id: number, request: ReturnType<typeof this.createRequest>) {
        const response = await request.finally(() => this.removeRequest(id, request.id))

        if (isErrorResponse(response)) {
            throw this.createRequestError(id, request.payload, `Request error: (${response.error.code}) ${response.error.msg}`).withResponse(response)
        }

        if (!isKeyOf(response, 'result')) {
            throw this.createRequestError(id, request.payload, 'Invalid response').withResponse(response)
        }

        return response.result
    }

    public createRequestError(id: number, payload?: any, message?: string, options?: ErrorOptions) {
        return new WebsocketRequestError(id, this.items[id], message, options).withRequest(payload)
    }

    public streamsCount(id: number) {
        return this.items[id].streams.size
    }

    public allStreams() {
        return unique(Object.values(this.all()).flatMap((ctx) => [...ctx.streams]))
    }

    public getStreams(id: number) {
        return [...this.items[id].streams]
    }

    public addStream(id: number, streams: string | string[]) {
        for (const stream of wrap(streams)) {
            this.items[id].streams.add(stream)
        }
    }

    public removeStream(id: number, streams: string | string[]) {
        for (const stream of wrap(streams)) {
            this.items[id].streams.delete(stream)
        }
    }
}
