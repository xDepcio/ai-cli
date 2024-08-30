import { expect } from '@oclif/test'
import { CopilotApi } from '../../src/lib/copilot-api.js'
import { STORE } from '../../src/index.js'
import { describe, it } from 'mocha'

describe('CopilotApi', () => {
    describe("chatCompletion", () => {
        it("Should return completions for a given prompt", async () => {
            const copilotApi = new CopilotApi({ store: STORE })
            // @ts-ignore
            let oldGenerateNewToken = CopilotApi.prototype.generateNewToken
            // @ts-ignore
            CopilotApi.prototype.generateNewToken = async () => { }
            let oldFetch = fetch
            // @ts-ignore
            fetch = async function () {
                return {
                    text: async () => {
                        return JSON.stringify([
                            {
                                choices: [
                                    {
                                        delta: {
                                            content: 'chmod'
                                        }
                                    },
                                ]
                            }
                        ])
                    }
                }
            }
            const completions = await copilotApi.chatCompletion({
                chat: [
                    {
                        role: 'user',
                        content: 'command for changing file permissionss on ubuntu.'
                    }
                ]
            })
            // @ts-ignore
            fetch = oldFetch
            // @ts-ignore
            CopilotApi.prototype.generateNewToken = oldGenerateNewToken

            expect(completions).to.equal('chmod')
        })
    })
})
