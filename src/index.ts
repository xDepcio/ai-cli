import { STORE_DIR_PATH } from './constants.js'
import { Store } from './lib/store.js'


export const STORE = new Store({ dirPath: STORE_DIR_PATH })

export { run } from '@oclif/core'
