import path from 'path'
import { STORE_DIR_PATH } from './constants.js'
import { Logger, logGranulaityEnvSchema } from './lib/logger.js'
import { Store } from './lib/store.js'
import { validateEnvVar } from './lib/validate-env.js'


export const STORE = new Store({ dirPath: STORE_DIR_PATH })
Logger.setOptions({
    logDest: 'file',
    logFile: path.join(STORE_DIR_PATH, 'log.log'),
    logGranularity: validateEnvVar('AI_CLI_LOG_GRANULARITY', logGranulaityEnvSchema) || 'DEBUG',
})

export { run } from '@oclif/core'
