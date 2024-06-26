import { Command } from '@oclif/core'
import chalk from 'chalk'
import fs from 'fs'
import { KEYPRESS_TO_COMPLETION_FETCH_TIMEOUT, STORE_DIR_PATH } from '../constants.js'
import { STORE } from '../index.js'
import { CompletionReturnData } from '../lib/copilot-api.js'
import { NewPromiseRegisteredError, makeSyncedPromise, sleepPromise } from '../lib/promise-lifo.js'
import { StdoutWriter } from '../lib/stdout-writer.js'
import { CompleteBackend } from './complete.js'

export default class InotifyDaemon extends Command {
    private syncedPromise = makeSyncedPromise()
    private completeBackend = new CompleteBackend()
    private writer = new StdoutWriter({ loadingMessage: ' (...)' })

    private async handleReadlineAccess() {
        const [readlineLine, readlineCursor, pwd, language, prePrompt] = fs.readFileSync(`${STORE_DIR_PATH}/readline_access.txt`, 'utf8').split('<=%SEP%=>')
        if (!readlineLine || !readlineCursor || !language || !prePrompt || !pwd) {
            return
        }
        let parsedReadlineCursor = parseInt(readlineCursor)
        this.writer.writeLoading(readlineLine, parsedReadlineCursor)

        this.syncedPromise(sleepPromise(KEYPRESS_TO_COMPLETION_FETCH_TIMEOUT))
            .then(() => this.handleCompletionRequest(language, prePrompt, readlineLine, parsedReadlineCursor))
            .catch((e) => { })
    }

    private handleCompletionRequest(language: string, prePrompt: string, readlineLine: string, parsedReadlineCursor: number) {
        this.syncedPromise(this.completeBackend.getCompletions({ language, prompt: '\n$ ' + readlineLine, prePrompt }))
            .then((result) => {
                if (!result) {
                    return
                }

                const completions = result as CompletionReturnData[]
                const completionsStr = completions.map(c => c.choices[0].text).join('')
                STORE.writeTextFile('completions.txt', completionsStr)

                this.writer.clearAppended(readlineLine, parsedReadlineCursor)
                if (completionsStr.length <= 0) {
                    return
                }

                this.writer.writeCompletion(readlineLine, parsedReadlineCursor, completionsStr)
            })
            .catch((e) => {
                if (e instanceof NewPromiseRegisteredError) {
                    return
                }

                if (e instanceof TypeError) {
                    if ((e?.cause as any)?.code === 'UND_ERR_CONNECT_TIMEOUT') {
                        process.stdout.write(chalk.bgRed('Copilot response timed out'))
                        return
                    }

                    console.error("type error", e)
                }

                console.error("not handled error", e)
            })
    }

    public async run(): Promise<void> {
        const { args, flags } = await this.parse(InotifyDaemon)

        return new Promise((resolve, reject) => {
            const watcher = fs.watch(`${STORE_DIR_PATH}/readline_access.txt`, () => this.handleReadlineAccess())
            watcher.on('close', () => {
                resolve()
            })
        })
    }
}
