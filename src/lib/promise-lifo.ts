/**
 * Create function to spawn synced promises.
 * When new promise is created using this spawn function, previous one is rejected.
 */
export function makeSyncedPromise() {
    let cancel: (...args: any) => any = () => { }
    return function (promise: Promise<any>) {
        cancel()
        let p = new Promise((resolve, reject) => cancel = reject)
        return Promise.race([p, promise])
    }
}
