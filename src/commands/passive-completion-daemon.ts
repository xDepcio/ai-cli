import { Command } from '@oclif/core'
import chalk from 'chalk'
import fs from 'fs'
import { STORE } from '../index.js'
import { curNLeft, curNRight } from '../lib/ansi-escapes.js'
import { CompleteBackend } from './complete.js'


export default class PassiveCompletionDaemon extends Command {
    private timeout: NodeJS.Timeout = setTimeout(() => { }, 0)

    private readCompletion() {
        const completion = fs.readFileSync('/home/adrwal/passive-completion.txt', 'utf8')
        return completion
    }

    private readReadlineData() {
        const readlineLine = fs.readFileSync('/home/adrwal/readline-line.txt', 'utf8')
        const readlinePoint = fs.readFileSync('/home/adrwal/readline-point.txt', 'utf8')
        return { readlineLine, readlinePoint }
    }

    private canComplete() {
        // @ts-ignore
        return this.timeout._destroyed
    }

    public async run(): Promise<void> {
        // const { args, flags } = await this.parse(PassiveCompletionDaemon)

        return new Promise((resolve, reject) => {
            const watcher = fs.watch('/home/adrwal/passive-completion.txt', {}, async (eventType, filename) => {
                await new Promise(resolve => setTimeout(resolve, 500))
                if (!this.canComplete()) {
                    return
                }
                this.timeout = setTimeout(() => { }, 500)

                const completion = this.readCompletion()
                const { readlineLine, readlinePoint } = this.readReadlineData()

                const cursorDistFromEnd = readlineLine.length - parseInt(readlinePoint)
                if (cursorDistFromEnd > 0) {
                    process.stdout.write(curNRight(cursorDistFromEnd))
                }
                process.stdout.write(chalk.dim(completion))
                process.stdout.write(curNLeft(completion.length))
                if (cursorDistFromEnd > 0) {
                    process.stdout.write(curNLeft(cursorDistFromEnd))
                }
            })
        })
    }
}
