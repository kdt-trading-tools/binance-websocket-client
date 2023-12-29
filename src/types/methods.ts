export type Method = 'SUBSCRIBE' | 'UNSUBSCRIBE' | 'LIST_SUBSCRIPTIONS' | 'SET_PROPERTY' | 'GET_PROPERTY'

export interface MethodArgs {
    SUBSCRIBE: [params: string[]]
    UNSUBSCRIBE: [params: string[]]
    LIST_SUBSCRIPTIONS: []
    SET_PROPERTY: [params: ['combined', boolean]]
    GET_PROPERTY: [params: ['combined']]
}

export interface MethodReturnType {
    SUBSCRIBE: null
    UNSUBSCRIBE: null
    LIST_SUBSCRIPTIONS: string[]
    SET_PROPERTY: null
    GET_PROPERTY: boolean
}
