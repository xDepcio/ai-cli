export class NewPromiseRegisteredError extends Error {
    constructor(message: string) {
        super(message)
    }
}

/**
 * Create function to spawn synced promises.
 * When new promise is created using this spawn function, previous one is rejected with NewPromiseRegisteredError error.
 */
export function makeSyncedPromise() {
    let cancel: (...args: any) => any = () => { }
    return function (promise: Promise<any>) {
        cancel(new NewPromiseRegisteredError("Promise canceled, since new promise was registred."))
        let p = new Promise((resolve, reject) => cancel = reject)
        return Promise.race([p, promise])
    }
}

export function sleepPromise(time: number) {
    return new Promise(resolve => setTimeout(resolve, time))
}
