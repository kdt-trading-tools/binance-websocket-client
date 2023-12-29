import { WebsocketClientError } from './websocket-client-error'

export class WebsocketRequestError extends WebsocketClientError {
    public declare request: any
    public declare response: any

    public withRequest(request: any) {
        this.request = request

        return this
    }

    public withResponse(response: any) {
        this.response = response

        return this
    }
}
