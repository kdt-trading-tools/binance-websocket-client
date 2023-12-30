export interface AggregateTradeStream {
    e: 'aggTrade'
    E: number
    s: string
    a: number
    p: string
    q: string
    f: number
    l: number
    T: number
    m: boolean
    M: boolean
}

export interface TradeStream {
    e: 'trade'
    E: number
    s: string
    t: number
    p: string
    q: string
    b: number
    a: number
    T: number
    m: boolean
    M: boolean
}

export interface Kline {
    t: number
    T: number
    s: string
    i: string
    f: number
    L: number
    o: string
    c: string
    h: string
    l: string
    v: string
    n: number
    x: boolean
    q: string
    V: string
    Q: string
    B: string
}

export interface KlineStream {
    e: 'kline'
    E: number
    s: string
    k: Kline
}

export interface MiniTickerStream {
    e: '24hrMiniTicker'
    E: number
    s: string
    c: string
    o: string
    h: string
    l: string
    v: string
    q: string
}

export interface TickerStream {
    e: '24hrTicker'
    E: number
    s: string
    p: string
    P: string
    w: string
    x: string
    c: string
    Q: string
    b: string
    B: string
    a: string
    A: string
    o: string
    h: string
    l: string
    v: string
    q: string
    O: number
    C: number
    F: number
    L: number
    n: number
}

export interface AveragePriceStream {
    e: 'avgPrice'
    E: number
    s: string
    i: string
    w: string
    T: number
}

export interface WindowTickerStream {
    e: '1hTicker' | '4hTicker' | '1dTicker'
    E: number
    s: string
    p: string
    P: string
    o: string
    h: string
    l: string
    c: string
    w: string
    v: string
    q: string
    O: number
    C: number
    F: number
    L: number
    n: number
}

export interface BookTickerStream {
    e: 'bookTicker'
    s: string
    b: string
    B: string
    a: string
    A: string
}

export interface TopDepthStream {
    lastUpdateId: number
    bids: Array<[price: string, quantity: string]>
    asks: Array<[price: string, quantity: string]>
}

export interface DepthStream {
    e: 'depthUpdate'
    E: number
    s: string
    U: number
    u: number
    b: Array<[price: string, quantity: string]>
    a: Array<[price: string, quantity: string]>
}
