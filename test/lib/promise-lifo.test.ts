import { expect, test } from '@oclif/test'
import { NewPromiseRegisteredError, makeSyncedPromise } from '../../src/lib/promise-lifo.js'

describe('makeSyncedPromise', () => {
    it("Should cancel previous funcs by rejecting them", () => {
        const sync1 = makeSyncedPromise()
        function syncedFunc(msg: string) {
            return sync1(new Promise(resolve => {
                setTimeout(() => resolve(msg), 50)
            }))
        }
    })

    type ValueTimeout = {
        key: string,
        val: number,
        timeout: number
    }
    let promisesResolveTimes = <T extends string>(key: T, valuesTimeouts: ValueTimeout[]) => {
        return test
            .add(key, () => {
                const sync = makeSyncedPromise()
                let contextValue: { [key: string]: any } = {}
                for (const { timeout, val, key } of valuesTimeouts) {
                    const syncPromise = sync(new Promise(resolve => setTimeout(() => resolve(val), timeout)))
                    contextValue[key] = syncPromise
                }
                return contextValue
            })
    }

    promisesResolveTimes('sync1', [
        { key: 'res1', timeout: 50, val: 1 },
        { key: 'res2', timeout: 10, val: 2 },
    ])
        .it('Should only resolve last added promise, when last would resolve first.', async (ctx) => {
            // @ts-ignore
            const res1Promise = ctx.sync1.res1 as Promise<number>
            // @ts-ignore
            const res2Promise = ctx.sync1.res2 as Promise<number>

            let reachedUnreachable = false
            let thrown = false
            try {
                await res1Promise
                reachedUnreachable = true
            } catch (e) {
                thrown = true
            }
            expect(reachedUnreachable).to.be.false
            expect(thrown).to.be.true

            const value2 = await res2Promise
            expect(value2).equal(2)
        })

    promisesResolveTimes('sync1', [
        { key: 'res1', timeout: 10, val: 1 },
        { key: 'res2', timeout: 50, val: 2 },
    ])
        .it("Should only resolve last added promise even if earlier would resolve first.", async (ctx) => {
            // @ts-ignore
            const res1Promise = ctx.sync1.res1 as Promise<number>
            // @ts-ignore
            const res2Promise = ctx.sync1.res2 as Promise<number>

            let reachedUnreachable = false
            let thrown = false
            try {
                await res1Promise
                reachedUnreachable = true
            } catch (e) {
                thrown = true
            }
            expect(reachedUnreachable).to.be.false
            expect(thrown).to.be.true

            const value2 = await res2Promise
            expect(value2).equal(2)
        })

    promisesResolveTimes('promiseSync', [
        { key: 'res1', timeout: 10, val: 1 },
        { key: 'res2', timeout: 50, val: 2 },
    ])
        .it("Should reject previous promises with NewPromiseRegisteredError", async (ctx) => {
            // @ts-ignore
            const res1Promise = ctx.promiseSync.res1 as Promise<number>
            // @ts-ignore
            const res2Promise = ctx.promiseSync.res2 as Promise<number>

            let thrown = false
            try {
                await res1Promise
            } catch (e) {
                thrown = true
                expect(e instanceof NewPromiseRegisteredError)
            }
            expect(thrown).to.be.true
        })
})
