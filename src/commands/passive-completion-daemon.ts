import { Command } from '@oclif/core'
import chalk from 'chalk'
import fs from 'fs'
import { curNLeft, curNRight } from '../lib/ansi-escapes.js'
import { checkProcessExists } from '../lib/process-checker.js'
import path from 'path'
import { Logger } from '../lib/logger.js'
import { STORE } from '../index.js'


export default class PassiveCompletionDaemon extends Command {
    private readonly completionFile = path.join(STORE.getDirPath(), 'passive-completion.txt')
    private readonly readlineLineFile = path.join(STORE.getDirPath(), 'readline-line.txt')
    private readonly readlinePointFile = path.join(STORE.getDirPath(), 'readline-point.txt')
    private readonly keepAliveFile = path.join(STORE.getDirPath(), 'keep-alive.txt')
    private readonly signalingProcessPidFile = path.join(STORE.getDirPath(), 'passive-completion-trigger-pid.txt')

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
        if (!fs.existsSync(this.keepAliveFile)) {
            fs.writeFileSync(this.keepAliveFile, '', 'utf8')
        }
        if (!fs.existsSync(this.signalingProcessPidFile)) {
            fs.writeFileSync(this.signalingProcessPidFile, '', 'utf8')
        }
    }

    private handleCompletionSugestionWrite() {
        const completion = this.readCompletion()
        if (!completion) {
            return
        }
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
        fs.watch(this.keepAliveFile, {}, async (eventType, filename) => { })
    }

    private readSignalingProcessPid() {
        while (true) {
            try {
                const triggerProcessPid = fs.readFileSync(this.signalingProcessPidFile, 'utf8')
                if (!triggerProcessPid) {
                    continue
                }
                const pid = parseInt(triggerProcessPid)
                return pid
            } catch (e) { }
        } // >:(
    }

    public async run(): Promise<void> {
        // const { args, flags } = await this.parse(PassiveCompletionDaemon)

        this.makeRequiredFiles()


        return new Promise((resolve, reject) => {
            process.on('SIGUSR2', () => {
                const signallingProcessPid = this.readSignalingProcessPid()
                Logger.getInstance().debug(`Signalling process pid: ${signallingProcessPid}`)

                while (checkProcessExists(signallingProcessPid)) { }
                this.handleCompletionSugestionWrite()
            })

            this.keepAlive()
        })
    }
}
