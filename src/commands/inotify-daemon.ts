import { Command } from '@oclif/core'
import chalk from 'chalk'
import fs from 'fs'
import { STORE } from '../index.js'
import { CompletionReturnData } from '../lib/copilot-api.js'
import { NewPromiseRegisteredError, makeSyncedPromise } from '../lib/promise-lifo.js'
import { StdoutWriter } from '../lib/stdout-writer.js'
import { CompleteBackend } from './complete.js'

export default class InotifyDaemon extends Command {
    private syncedPromise = makeSyncedPromise()
    private completeBackend = new CompleteBackend()
    private writer = new StdoutWriter({ loadingMessage: ' (...)' })
    // private oldStraceSize = 0
    // private straceFd = fs.openSync('/home/olek/.ai-cli/strace.log', 'r')

    // private readLatestWriteData() {
    //     const newStraceSize = fs.statSync('./strace.log').size
    //     const buffer = Buffer.alloc(newStraceSize - this.oldStraceSize)
    //     fs.readSync(this.straceFd, buffer, 0, buffer.length, this.oldStraceSize)
    //     this.oldStraceSize = newStraceSize
    //     const latestWrite = buffer.toString().split('\n').at(-2)
    //     if (!latestWrite) {
    //         return {
    //             fd: null,
    //             data: null,
    //             dataLength: null
    //         }
    //     }
    //     const [fd, data, dataLength] = latestWrite!.replace(/write/g, '').slice(1, -1).split(', ')
    //     return { fd, data, dataLength }
    // }

    private async handleReadlineAccess() {
        const [readlineLine, readlineCursor, pwd, language, prePrompt] = fs.readFileSync('/home/olek/.ai-cli/readline_access.txt', 'utf8').split('<=%SEP%=>')
        if (!readlineLine || !readlineCursor || !language || !prePrompt || !pwd) {
            return
        }

        // const { data } = this.readLatestWriteData()
        // if (data === `"\\n"`) {
        //     this.syncedPromise(new Promise(resolve => resolve(void 0)))
        //     return
        // }

        let parsedReadlineCursor = parseInt(readlineCursor)
        this.writer.writeLoading(readlineLine, parsedReadlineCursor)
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
                        process.stdout.write(chalk.bgRed('Copilot timeout out'))
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
            const watcher = fs.watch('/home/olek/.ai-cli/readline_access.txt', () => this.handleReadlineAccess())
            watcher.on('close', () => {
                resolve()
            })
        })
    }
}
