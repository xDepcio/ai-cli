import chalk from "chalk"
import { curNLeft, curNRight, eraseFromCursorToEndLine } from "./ansi-escapes.js"

type StdoutWriterOptions = {
    loadingMessage: string
}
class StdoutWriter {
    private loadingMessage: string

    constructor({ loadingMessage }: StdoutWriterOptions) {
        this.loadingMessage = loadingMessage
    }

    public writeLoading(readlineLine: string, readlineCursor: number) {
        process.stdout.write(curNRight((readlineLine.length - 1) - readlineCursor) + eraseFromCursorToEndLine)
        process.stdout.write(chalk.dim(this.loadingMessage) + curNLeft(6))
        process.stdout.write(curNLeft((readlineLine.length - 1) - readlineCursor))
    }

    public clearAppended(readlineLine: string, readlineCursor: number) {
        process.stdout.write(curNRight((readlineLine.length - 1) - readlineCursor) + eraseFromCursorToEndLine)
        process.stdout.write(curNLeft((readlineLine.length - 1) - readlineCursor))
    }

    public writeCompletion(readlineLine: string, readlineCursor: number, completionsStr: string) {
        process.stdout.write(curNRight((readlineLine.length - 1) - readlineCursor))
        process.stdout.write(chalk.dim(completionsStr) + curNLeft(completionsStr.length))
        process.stdout.write(curNLeft((readlineLine.length - 1) - readlineCursor))
    }
}

export {
    StdoutWriter
}
