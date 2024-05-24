import { Command } from '@oclif/core'
import { STORE } from '../index.js'
import { CopilotApi } from '../lib/copilot-api.js'

export default class Signin extends Command {
    static override description = 'Sign in to Github.'

    public async run(): Promise<void> {
        const copilotApi = new CopilotApi({ store: STORE })
        await copilotApi.setupDevice()
        this.log("Successfully authenticated.")
    }
}
