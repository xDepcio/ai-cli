import { Args, Command, Flags } from '@oclif/core'
import { ChatMessage, CopilotApi } from '../lib/copilot-api.js'
import { STORE } from '../index.js'
import { readFileSync } from 'fs'

export default class Chat extends Command {
    copilotApi: CopilotApi = new CopilotApi({ store: STORE })

    static override args = {
        // file: Args.string({ description: 'file to read' }),
    }

    static override description = `Get GPT-4o chat completion.
chat schema:
{
    role: "user" | "assistant",
    content: string
}[]`

    static override examples = [
        '<%= config.bin %> <%= command.id %> -f chat.json',
        `<%= config.bin %> <%= command.id %> -t '[{"role":"user","content":"command for changing file permissionss on ubuntu."}]'`,
    ]

    static override flags = {
        file: Flags.string({
            char: 'f',
            exclusive: ['text'],
            description: 'Read JSON chat messages from file.',
        }),
        text: Flags.string({
            char: 't',
            description: `Read JSON chat messages as flag's value`, exclusive: ['file'],

        }),
    }

    public async run(): Promise<void> {
        const { args, flags } = await this.parse(Chat)

        if (!flags.file && !flags.text) {
            this.error('You must provide either --file or --text flag.')
        }

        let chat: ChatMessage[] = []
        if (flags.file) {
            chat = JSON.parse(readFileSync(flags.file, 'utf-8'))
        }
        else if (flags.text) {
            chat = JSON.parse(flags.text)
        }
        else {
            throw new Error('Unreachable code.')
        }


        const completion = await this.copilotApi.chatCompletion({
            chat: chat
        })

        this.log(completion)
    }
}
