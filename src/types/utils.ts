import type { createDeferred } from '@khangdt22/utils/promise'

export type DeferredPromise<T> = ReturnType<typeof createDeferred<T>>
