import { Args, Command, Flags } from '@oclif/core'
import { CompletionReturnData, CopilotApi } from '../lib/copilot-api.js'
import { STORE } from '../index.js'
import fs from 'fs'

export default class Complete extends Command {
    // static override args = {
    //   file: Args.string({description: 'file to read'}),
    // }

    // static override description = 'describe the command here'
    copilotApi: CopilotApi = new CopilotApi({ store: STORE })

    static override examples = [
        `<%= config.bin %> <%= command.id %> -l python -f main.py`,
        `<%= config.bin %> <%= command.id %> -s <<EOF`,
        `<%= config.bin %> <%= command.id %> -s <prompt.txt`,
        `<%= config.bin %> <%= command.id %> -f prompt.txt`,
        `<%= config.bin %> <%= command.id %> -t "Copilot complete this line..."`,
    ]

    static override flags = {
        file: Flags.string({
            char: 'f',
            description: 'Take prompt from file',
            relationships: [{ type: 'none', flags: ['text', 'stdin'] }],
        }),
        text: Flags.string({
            char: 't',
            description: 'Take prompt from text string',
            relationships: [{ type: 'none', flags: ['file', 'stdin'] }],
        }),
        stdin: Flags.boolean({
            char: 's',
            description: 'Use stdin redirection for prompt',
            relationships: [{ type: 'none', flags: ['file', 'text'] }],
        }),
        language: Flags.string({
            char: 'l',
            description: 'Specify completion language.',
            required: true,
        }),
        prePrompt: Flags.string({
            char: 'p',
            description: 'Text to prepend to prompt.',
        })
    }

    public async run(): Promise<void> {
        const { args, flags } = await this.parse(Complete)
        const completeBackend = new CompleteBackend()

        let completions: CompletionReturnData[] = []
        switch (true) {
            case flags.stdin:
                const stdinStr = await this.getPromptFromStdin()
                completions = await completeBackend.getCompletions({ prompt: stdinStr, language: flags.language, prePrompt: flags.prePrompt })
                break
            case !!flags.text:
                completions = await completeBackend.getCompletions({ prompt: flags.text, language: flags.language, prePrompt: flags.prePrompt })
                break
            case !!flags.file:
                const fileContent = fs.readFileSync(flags.file, 'utf8')
                completions = await completeBackend.getCompletions({ prompt: fileContent, language: flags.language, prePrompt: flags.prePrompt })
                break
            default:
                break
        }
        process.stdout.write(completions.map(c => c.choices[0].text).join(''))
    }

    private async getPromptFromStdin(): Promise<string> {
        return new Promise((resolve, reject) => {
            process.stdin.on('readable', () => {
                const chunk = process.stdin.read();
                console.log('chunk:', chunk)
                console.log('chunkstr:', chunk.toString())
                if (chunk !== null) {
                    resolve(chunk.toString())
                }
            })
            process.stdin.on('error', (err) => {
                reject(err)
            })
        })
    }
}

export interface ICompleteBackend {
    getCompletions({ language, prompt, prePrompt }: { prompt: string, language: string, prePrompt?: string }): Promise<CompletionReturnData[]>
}
export class CompleteBackend implements ICompleteBackend {
    private copilotApi: CopilotApi
    constructor() {
        this.copilotApi = new CopilotApi({ store: STORE })
    }

    public async getCompletions({ language, prompt, prePrompt = '' }: { prompt: string, language: string, prePrompt?: string }): Promise<CompletionReturnData[]> {
        const completions = await this.copilotApi.getCommandCompletion({ prompt, language, prePrompt })
        return completions
    }
}
