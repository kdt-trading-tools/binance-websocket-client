import { isObject } from '@khangdt22/utils/object'
import type { ErrorResponse } from '../types'

export function isErrorResponse(response: any): response is ErrorResponse {
    return isObject(response) && 'error' in response && 'code' in response.error && 'msg' in response.error
}

export function chunkStreams(streams: string[], maxPayload: number, requestId: number) {
    const baseLength = JSON.stringify({ id: requestId, method: 'SUBSCRIBE', params: [] }).length
    const result: string[][] = []

    if (baseLength + JSON.stringify(streams).length - 2 <= maxPayload) {
        return [streams]
    }

    let i = 0
    let totalLength = baseLength

    for (const stream of streams) {
        const length = JSON.stringify(stream).length + 1

        totalLength += length

        if (totalLength >= maxPayload) {
            i++
            totalLength = baseLength - String(requestId).length + String(requestId + i).length + length
        }

        result[i] ??= []
        result[i].push(stream)
    }

    return result
}
