import { expect, test } from '@oclif/test'
import { NewPromiseRegisteredError, makeSyncedPromise } from '../../src/lib/promise-lifo.js'
import { Logger } from '../../src/lib/logger.js'
import tmp from 'tmp'
import { z } from 'zod'
import { validateEnvVar } from '../../src/lib/validate-env.js'
import { assert } from 'chai'
import { readFileSync } from 'fs'

describe('validateEnvVar function', () => {
    beforeEach(() => {
        Logger.clearInstance()
    })

    it("Should throw zod error on validation error", () => {
        const exampleEnvSchema = z.enum(['A', 'B'])
        process.env.TEST_EXAMPLE_ENV = 'C'
        try {
            validateEnvVar('TEST_EXAMPLE_ENV', exampleEnvSchema)
            expect.fail('Should throw error')
        } catch (error) {
            assert.equal(error instanceof z.ZodError, true)
        }
    })

    it('Should log error on validation error', () => {
        const tempFile = tmp.fileSync()
        Logger.setOptions({
            logDest: 'file',
            logFile: tempFile.name,
            logGranularity: 'DEBUG',
        })
        const exampleEnvSchema = z.enum(['A', 'B'])
        process.env.TEST_EXAMPLE_ENV = 'C'
        try {
            validateEnvVar('TEST_EXAMPLE_ENV', exampleEnvSchema)
            expect.fail('Should throw error')
        } catch (error) {
            const logContent = readFileSync(tempFile.name)
            expect(logContent.toString()).to.include(
                `Error validating env var TEST_EXAMPLE_ENV: [
    {
        "received": "C",
        "code": "invalid_enum_value",
        "options": [
            "A",
            "B"
        ],
        "path": [],
        "message": "Invalid enum value. Expected 'A' | 'B', received 'C'"
    }
]`
            )
        }
    })

    it('Should return value on validation success', () => {
        const exampleEnvSchema = z.enum(['A', 'B'])
        process.env.TEST_EXAMPLE_ENV = 'A'
        const result = validateEnvVar('TEST_EXAMPLE_ENV', exampleEnvSchema)
        assert.equal(result, 'A')
    })
})
