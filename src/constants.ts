export enum Market {
    SPOT = 'spot',
    USDM = 'usdm',
    COINM = 'coinm',
}

export const baseUrls: Record<Market, string> = {
    [Market.SPOT]: 'wss://stream.binance.com',
    [Market.USDM]: 'wss://fstream.binance.com',
    [Market.COINM]: 'wss://dstream.binance.com',
}

export const baseTestnetUrls: Record<Market, string> = {
    [Market.SPOT]: 'wss://testnet.binance.vision',
    [Market.USDM]: 'wss://stream.binancefuture.com',
    [Market.COINM]: 'wss://dstream.binancefuture.com',
}

export const maxStreamsPerConnection: Record<Market, number> = {
    [Market.SPOT]: 1024,
    [Market.USDM]: 200,
    [Market.COINM]: 200,
}
