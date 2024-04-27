import { Command, Flags } from '@oclif/core'
import chalk from 'chalk'
import { exec, spawnSync } from 'child_process'
import fs from 'fs'
import { STORE } from '../index.js'
import { curNLeft, curNRight, eraseFromCursorToEndLine } from '../lib/ansi-escapes.js'
import { CompletionReturnData } from '../lib/copilot-api.js'
import { CompleteBackend } from './complete.js'

let cancel: (...args: any) => any = () => { }
const completeBackend = new CompleteBackend()
export default class StraceDaemon extends Command {
    static override flags = {
        pid: Flags.string({ char: 'p', description: 'bash pid to trace', required: true }),
    }

    private spawnPerlScript() {
        spawnSync('perl', ['-e', `ioctl STDOUT, 0x5412, $_ for split //, do{ chomp($_ = " "); $_ }`], { stdio: ['ignore', 'inherit', 'ignore'] })
    }

    private async handleReadlineAccess() {
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
        Promise.race([p, completeBackend.getCompletions({ language, prompt, prePrompt })]).then((result) => {
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
    }

    public async run(): Promise<void> {
        const { args, flags } = await this.parse(StraceDaemon)

        return new Promise((resolve, reject) => {
            const strace = exec(`strace -qqq -f -p ${flags.pid} -s 1000 -e trace=write 2>&1 | rg --line-buffered -o 'write\\(2, "[!-~ ]", 1\\)' | tee strace.log`)
            strace.on('exit', () => {
                resolve()
            })
            fs.watch('strace.log', this.spawnPerlScript)
            fs.watch('/home/olek/.ai-cli/readline_access.txt', this.handleReadlineAccess)
        })
    }
}
