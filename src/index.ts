import { STORE_DIR_PATH } from './constants.js'
import { Logger } from './lib/logger.js'
import { Store } from './lib/store.js'


export const STORE = new Store({ dirPath: STORE_DIR_PATH })
export const CONSOLE_LOGGER = new Logger({ logDest: 'console', supressInternalLogs: true })
export const FILE_LOGGER = new Logger({ logDest: 'file', logFile: STORE_DIR_PATH + '/log.log' })

export { run } from '@oclif/core'
