import { Command } from '@oclif/core'
import chalk from 'chalk'
import fs from 'fs'
import { STORE } from '../index.js'
import { curNLeft, curNRight, eraseFromCursorToEndLine } from '../lib/ansi-escapes.js'
import { CompletionReturnData } from '../lib/copilot-api.js'
import { CompleteBackend } from './complete.js'
import { NewPromiseRegisteredError, makeSyncedPromise } from '../lib/promise-lifo.js'

export default class InotifyDaemon extends Command {
    private syncedPromise = makeSyncedPromise()
    private completeBackend = new CompleteBackend()

    private async handleReadlineAccess() {
        const [readlineLine, readlineCursor, pwd, language, prePrompt] = fs.readFileSync('/home/olek/.ai-cli/readline_access.txt', 'utf8').split('<=%SEP%=>')
        if (!readlineLine || !readlineCursor || !language || !prePrompt || !pwd) {
            return
        }
        let parsedReadlineCursor = parseInt(readlineCursor)
        // process.stdout.write(curNRight((readlineLine.length - 1) - parsedReadlineCursor) + eraseFromCursorToEndLine)
        // process.stdout.write(chalk.dim('     ⟳') + curNLeft(6))
        // process.stdout.write(curNLeft((readlineLine.length - 1) - parsedReadlineCursor))
        const prompt = '\n$ ' + readlineLine
        this.syncedPromise(this.completeBackend.getCompletions({ language, prompt, prePrompt }))
            .then((result) => {
                if (!result) {
                    return
                }

                const completions = result as CompletionReturnData[]
                const completionsStr = completions.map(c => c.choices[0].text).join('')
                STORE.writeTextFile('completions.txt', completionsStr)
                process.stdout.write(curNRight((readlineLine.length - 1) - parsedReadlineCursor) + eraseFromCursorToEndLine)
                process.stdout.write(curNLeft((readlineLine.length - 1) - parsedReadlineCursor))
                if (completionsStr.length <= 0) {
                    return
                }

                process.stdout.write(curNRight((readlineLine.length - 1) - parsedReadlineCursor))
                process.stdout.write(chalk.dim(completionsStr) + curNLeft(completionsStr.length))
                process.stdout.write(curNLeft((readlineLine.length - 1) - parsedReadlineCursor))
            })
            .catch((e) => {
                if (e instanceof NewPromiseRegisteredError) {
                    return
                }

                if (e instanceof TypeError) {
                    if ((e.cause as any).code === 'UND_ERR_CONNECT_TIMEOUT') {
                        process.stdout.write(chalk.bgRed('Copilot timeout out'))
                    }
                    return
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
