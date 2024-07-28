import { Command } from '@oclif/core'
import chalk from 'chalk'
import fs from 'fs'
import { curNLeft, curNRight } from '../lib/ansi-escapes.js'
import { checkProcessExists } from '../lib/process-checker.js'
import path from 'path'
import { STORE_DIR_PATH } from '../constants.js'


export default class PassiveCompletionDaemon extends Command {
    private timeout: NodeJS.Timeout = setTimeout(() => { }, 0)
    private readonly completionFile = path.join(STORE_DIR_PATH, 'passive-completion.txt')
    private readonly readlineLineFile = path.join(STORE_DIR_PATH, 'readline-line.txt')
    private readonly readlinePointFile = path.join(STORE_DIR_PATH, 'readline-point.txt')
    private readonly keepAliveFile = path.join(STORE_DIR_PATH, 'keep-alive.txt')

    private readCompletion() {
        const completion = fs.readFileSync(this.completionFile, 'utf8')
        return completion
    }

    private readReadlineData() {
        const readlineLine = fs.readFileSync(this.readlineLineFile, 'utf8')
        const readlinePoint = fs.readFileSync(this.readlinePointFile, 'utf8')
        return { readlineLine, readlinePoint }
    }

    private makeRequiredFiles() {
        if (!fs.existsSync(this.completionFile)) {
            fs.writeFileSync(this.completionFile, '', 'utf8')
        }
        if (!fs.existsSync(this.readlineLineFile)) {
            fs.writeFileSync(this.readlineLineFile, '', 'utf8')
        }
        if (!fs.existsSync(this.readlinePointFile)) {
            fs.writeFileSync(this.readlinePointFile, '', 'utf8')
        }
    }

    private handleCompletionSugestionWrite() {
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
    }

    private keepAlive() {
        if (!fs.existsSync(this.keepAliveFile)) {
            fs.writeFileSync(this.keepAliveFile, '', 'utf8')
        }
        fs.watch(this.keepAliveFile, {}, async (eventType, filename) => { })
    }

    public async run(): Promise<void> {
        // const { args, flags } = await this.parse(PassiveCompletionDaemon)

        this.makeRequiredFiles()


        return new Promise((resolve, reject) => {
            process.on('SIGUSR2', () => {
                this.handleCompletionSugestionWrite()
            })

            this.keepAlive()
        })
    }
}
