import { expect, test } from '@oclif/test'
import { makeSyncedPromise } from '../../src/lib/promise-lifo.js'
// import chai from 'chai'
// import chai from 'cha'

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
    let promisesResolveTimes = (key: string, valuesTimeouts: ValueTimeout[]) => {
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
        { key: 'res1', timeout: 100, val: 1 },
        { key: 'res2', timeout: 50, val: 2 },
    ])
        .it('should only resolve last added promise. Last would resolve first.', async (ctx) => {
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

})
