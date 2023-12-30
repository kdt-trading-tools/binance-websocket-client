import type { KlineStream, Kline, MiniTickerStream } from './spot'

export interface FuturesAggregateTradeStream {
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
}

export interface FuturesMarkPriceStream {
    e: 'markPriceUpdate'
    E: number
    s: string
    p: string
    i: string
    P: string
    r: string
    T: number
}

export type FuturesKlineStream = KlineStream

export interface FuturesContinuousKlineStream {
    e: 'continuousKline'
    E: number
    ps: string
    ct: number
    k: Kline
}

export type FuturesMiniTickerStream = MiniTickerStream

export interface FuturesTickerStream {
    e: '24hrTicker'
    E: number
    s: string
    p: string
    P: string
    w: string
    c: string
    Q: string
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

export interface FuturesBookTickerStream {
    e: 'bookTicker'
    u: number
    E: number
    T: number
    s: string
    b: string
    B: string
    a: string
    A: string
}

export interface LiquidationOrder {
    s: string
    S: string
    o: string
    f: string
    q: string
    p: string
    ap: string
    X: string
    l: string
    z: string
    T: number
}

export interface FuturesLiquidationOrderStream {
    e: 'forceOrder'
    E: number
    o: LiquidationOrder
}

export interface FuturesDepthStream {
    e: 'depthUpdate'
    E: number
    T: number
    s: string
    U: number
    u: number
    pu: number
    b: Array<[price: string, quantity: string]>
    a: Array<[price: string, quantity: string]>
}

export interface CompositeIndex {
    b: string
    q: string
    w: string
    W: string
    i: string
}

export interface FuturesCompositeIndexStream {
    e: 'compositeIndex'
    E: number
    s: string
    p: string
    C: string
    c: CompositeIndex[]
}

export interface FuturesContractInfoStream {
    e: 'contractInfo'
    E: number
    s: string
    ps: string
    ct: number
    dt: number
    ot: number
    cs: string
    bks: Array<{
        bs: number
        bnf: number
        bnc: number
        mmr: number
        cf: number
        mi: number
        ma: number
    }>
}

export interface FuturesMultipleAssetsModeStream {
    e: 'assetIndexUpdate'
    E: number
    s: string
    i: string
    b: string
    a: string
    B: string
    A: string
    q: string
    g: string
    Q: string
    G: string
}
