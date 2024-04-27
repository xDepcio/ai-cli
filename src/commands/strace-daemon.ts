import { Args, Command, Flags, ux } from '@oclif/core'
import fs from 'fs'
import { CompleteBackend, ICompleteBackend } from './complete.js'
import { CompletionReturnData } from '../lib/copilot-api.js'
import { STORE } from '../index.js'
import chalk from 'chalk'
import { curNLeft, curNRight, eraseFromCursorToEndLine } from '../lib/ansi-escapes.js'
import { exec, execSync, spawn, spawnSync } from 'child_process'
import { v4 as uuidv4 } from 'uuid'

type DaemonMessage = 'suggest' | 'exit' | ''
type DaemonParsedMessage = {
    message: 'suggest',
    language: string,
    prompt: string,
    prePrompt: string,
    readlineCusror: number
    readlineLine: string
} | {
    message: 'exit'
} | {
    message: 'none'
}

export default class StraceDaemon extends Command {
    static override flags = {
        pid: Flags.string({ char: 'p', description: 'bash pid to trace', required: true }),
    }


    public async run(): Promise<void> {
        const { args, flags } = await this.parse(StraceDaemon)
        let cancel: (...args: any) => any = () => { }
        return new Promise((resolve, reject) => {
            const strace = exec(`strace -qqq -f -p ${flags.pid} -s 1000 -e trace=write 2>&1 | rg --line-buffered -o 'write\\(2, "[!-~ ]", 1\\)' | tee strace.log`)
            strace.on('exit', () => {
                resolve()
            })
            fs.watch('strace.log', (eventType, filename) => {
                spawnSync('perl', ['-e', `ioctl STDOUT, 0x5412, $_ for split //, do{ chomp($_ = " "); $_ }`], { stdio: ['ignore', 'inherit', 'ignore'] })
            })
            const completeBackend = new CompleteBackend()
            fs.watch('/home/olek/.ai-cli/readline_access.txt', async (eventType, filename) => {
                const [language, prompt, prePrompt, readlineCursor, readlineLine] = fs.readFileSync('/home/olek/.ai-cli/readline_access.txt', 'utf8').split('<=%SEP%=>')
                if (!readlineLine || !readlineCursor) {
                    return
                }
                cancel()
                let p = new Promise(resolve => cancel = resolve)
                let parsedReadlineCursor = parseInt(readlineCursor)
                process.stdout.write(curNRight((readlineLine.length - 1) - parsedReadlineCursor) + eraseFromCursorToEndLine)
                process.stdout.write(chalk.dim('...') + curNLeft(3))
                process.stdout.write(curNLeft((readlineLine.length - 1) - parsedReadlineCursor))
                Promise.race([p, getCompletion({ language, prompt, prePrompt })]).then((result) => {
                    if (result) {
                        const completions = result as CompletionReturnData[]
                        const completionsStr = completions.map(c => c.choices[0].text).join('')
                        STORE.writeTextFile('completions.txt', completionsStr)
                        if (completionsStr.length > 0) {
                            process.stdout.write(curNRight((readlineLine.length - 1) - parsedReadlineCursor))
                            process.stdout.write(chalk.dim(completionsStr) + curNLeft(completionsStr.length))
                            process.stdout.write(curNLeft((readlineLine.length - 1) - parsedReadlineCursor))
                        }
                    }
                })
            })
        })
    }
}
function getCompletion({ language, prompt, prePrompt }: Parameters<ICompleteBackend['getCompletions']>[0]): Promise<CompletionReturnData[]> {
    const completionsBackend = new CompleteBackend()
    return completionsBackend.getCompletions({ language, prompt, prePrompt })
    // return new Promise((resolve) => {
    //     setTimeout(() => resolve('eloelo320'), 500)
    // })
}
function syncedPromise<T>(promise: Promise<T>) {
    let resolved = false
    let resolvedValue: T
    promise.then(value => {
        resolved = true
        resolvedValue = value
    })
    return () => {
        if (resolved) {
            return resolvedValue
        }
    }
}
