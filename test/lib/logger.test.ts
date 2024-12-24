import { expect, test } from '@oclif/test'
import { NewPromiseRegisteredError, makeSyncedPromise } from '../../src/lib/promise-lifo.js'
import { Logger, LoggerOptionsNotSetError } from '../../src/lib/logger.js'
import tmp from 'tmp'
import { z } from 'zod'
import { validateEnvVar } from '../../src/lib/validate-env.js'
import { assert } from 'chai'
import { readFileSync } from 'fs'

describe('Logger class', () => {
    beforeEach(() => {
        Logger.clearInstance()
    })

    it("Should throw error when trying to getInstance before setting options", () => {
        try {
            Logger.getInstance()
            expect.fail('Should throw error')
        } catch (error) {
            expect(error instanceof LoggerOptionsNotSetError).to.be.true
        }
    })

    describe('doesGranularityAllowLogType method', () => {
        beforeEach(() => {
            Logger.clearInstance()
        })
        const testCases = [
            {
                loggerGranularity: 'DEBUG',
                allowedLogTypes: ['DEBUG', 'INFO', 'ERROR'],
            },
            {
                loggerGranularity: 'ERROR',
                allowedLogTypes: ['ERROR', 'INFO'],
            },
            {
                loggerGranularity: 'INFO',
                allowedLogTypes: ['INFO'],
            },
        ]
        testCases.forEach(({ loggerGranularity, allowedLogTypes }) => {
            it(`Should allow correct logs for ${loggerGranularity} level`, () => {
                Logger.setOptions({
                    logDest: 'console',
                    logGranularity: loggerGranularity as any,
                })
                allowedLogTypes.forEach((logType) => {
                    expect(Logger.getInstance().doesGranularityAllowLogType(logType as any)).to.be.true
                })
            })
        })
    })
})
