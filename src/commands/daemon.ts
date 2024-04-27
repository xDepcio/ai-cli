import { Args, Command, Flags, ux } from '@oclif/core'
import fs from 'fs'
import { CompleteBackend } from './complete.js'
import { CompletionReturnData } from '../lib/copilot-api.js'
import { STORE } from '../index.js'
import chalk from 'chalk'
import { curNLeft, curNRight } from '../lib/ansi-escapes.js'

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

export default class Daemon extends Command {
    // static override args = {
    //   file: Args.string({description: 'file to read'}),
    // }

    // static override description = 'describe the command here'

    // static override examples = [
    //   '<%= config.bin %> <%= command.id %>',
    // ]

    // static override flags = {
    //   // flag with no value (-f, --force)
    //   force: Flags.boolean({char: 'f'}),
    //   // flag with a value (-n, --name=VALUE)
    //   name: Flags.string({char: 'n', description: 'name to print'}),
    // }

    private parseMessage(): DaemonParsedMessage {
        const fileContent = fs.readFileSync('test.txt', 'utf8')
        if (fileContent === '') {
            return { message: 'none' }
        }
        fs.writeFileSync('test.txt', '')

        const [message, ...args] = fileContent.split('<=%SEP%=>') as [DaemonMessage, ...string[]]
        switch (message) {
            case 'suggest':
                const [language, prompt, prePrompt, readlineCusror, readlineLine] = args
                return {
                    message: 'suggest',
                    language,
                    prompt,
                    prePrompt,
                    readlineCusror: parseInt(readlineCusror),
                    readlineLine
                }
            case 'exit':
                return { message: 'exit' }
            default:
                throw new Error(`Unknown message: ${message}`)
        }
    }

    public async run(): Promise<void> {
        const { args, flags } = await this.parse(Daemon)

        return new Promise((resolve, reject) => {
            let i = 0

            const watcher = fs.watch('test.txt', {}, async (eventType, filename) => {
                if (!filename || eventType !== 'change') {
                    console.log('no filename or not change')
                    return
                }

                const daemonMessage = this.parseMessage()
                switch (daemonMessage.message) {
                    case 'suggest':
                        process.stdout.write(curNRight((daemonMessage.readlineLine.length - 1) - daemonMessage.readlineCusror))
                        process.stdout.write(chalk.dim('...') + curNLeft(3))
                        process.stdout.write(curNLeft((daemonMessage.readlineLine.length - 1) - daemonMessage.readlineCusror))

                        const completeBackend = new CompleteBackend()
                        const completions = (await completeBackend.getCompletions({ language: daemonMessage.language, prompt: daemonMessage.prompt, prePrompt: daemonMessage.prePrompt })).completions
                        const completionsStr = completions.map(c => c.choices[0].text).join('')
                        STORE.writeTextFile('completions.txt', completionsStr)

                        process.stdout.write(curNRight((daemonMessage.readlineLine.length - 1) - daemonMessage.readlineCusror))
                        process.stdout.write(chalk.dim(completionsStr) + curNLeft(completionsStr.length))
                        process.stdout.write(curNLeft((daemonMessage.readlineLine.length - 1) - daemonMessage.readlineCusror))
                        break
                    case 'exit':
                        watcher.close()
                        resolve()
                        return
                    default:
                        break
                }
            })
        })
    }
}
