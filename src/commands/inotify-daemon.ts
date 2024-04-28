import { Command, Flags } from '@oclif/core'
import chalk from 'chalk'
import fs from 'fs'
import { STORE } from '../index.js'
import { curNLeft, curNRight, eraseFromCursorToEndLine } from '../lib/ansi-escapes.js'
import { CompletionReturnData } from '../lib/copilot-api.js'
import { CompleteBackend } from './complete.js'

let cancel: (...args: any) => any = () => { }
const completeBackend = new CompleteBackend()
export default class InotifyDaemon extends Command {

    private async handleReadlineAccess() {
        const [readlineLine, readlineCursor, pwd, language, prePrompt] = fs.readFileSync('/home/olek/.ai-cli/readline_access.txt', 'utf8').split('<=%SEP%=>')
        if (!readlineLine || !readlineCursor || !language || !prePrompt || !pwd) {
            return
        }
        cancel()
        let p = new Promise(resolve => cancel = resolve)
        let parsedReadlineCursor = parseInt(readlineCursor)
        // process.stdout.write(curNRight((readlineLine.length - 1) - parsedReadlineCursor) + eraseFromCursorToEndLine)
        // process.stdout.write(chalk.dim('     ⟳') + curNLeft(6))
        // process.stdout.write(curNLeft((readlineLine.length - 1) - parsedReadlineCursor))
        const prompt = '\n$ ' + readlineLine
        Promise.race([p, completeBackend.getCompletions({ language, prompt, prePrompt })]).then((result) => {
            if (result) {
                const completions = result as CompletionReturnData[]
                const completionsStr = completions.map(c => c.choices[0].text).join('')
                STORE.writeTextFile('completions.txt', completionsStr)
                process.stdout.write(curNRight((readlineLine.length - 1) - parsedReadlineCursor) + eraseFromCursorToEndLine)
                process.stdout.write(curNLeft((readlineLine.length - 1) - parsedReadlineCursor))
                if (completionsStr.length > 0) {

                    process.stdout.write(curNRight((readlineLine.length - 1) - parsedReadlineCursor))
                    process.stdout.write(chalk.dim(completionsStr) + curNLeft(completionsStr.length))
                    process.stdout.write(curNLeft((readlineLine.length - 1) - parsedReadlineCursor))
                }
            }
        })
    }

    public async run(): Promise<void> {
        const { args, flags } = await this.parse(InotifyDaemon)

        return new Promise((resolve, reject) => {
            const watcher = fs.watch('/home/olek/.ai-cli/readline_access.txt', this.handleReadlineAccess)
            watcher.on('close', () => {
                resolve()
            })
        })
    }
}
