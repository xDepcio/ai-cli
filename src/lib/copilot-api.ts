import { inspect } from "util"
import { FILE_LOGGER } from "../index.js"
import { IStore } from "./store.js"

type CopilotApiConfig = {
    githubAccessToken: string | null,
    githubToken: string | null
}

class ErrorTokenNotSet extends Error {
    constructor() {
        super('Github access token not set. Please run `signin` to authenticate.')
    }

}

type ChatMessage = {
    role: "user" | "assistant",
    content: string
}

class CopilotApi {
    private store: IStore
    private readonly configFile = 'copilot-api.json'

    constructor({ store }: { store: IStore }) {
        this.store = store
    }

    public async setupDevice() {
        const initResponse = await fetch("https://github.com/login/device/code", {
            method: "POST",
            headers: {
                'accept': 'application/json',
                'editor-version': 'Neovim/0.6.1',
                'editor-plugin-version': 'copilot.vim/1.16.0',
                'content-type': 'application/json',
                'user-agent': 'GithubCopilot/1.155.0',
                'accept-encoding': 'gzip,deflate,br'
            },
            body: JSON.stringify({
                client_id: "Iv1.b507a08c87ecfe98",
                scope: "read:user"
            })
        })
        const initJson = await initResponse.json()
        const deviceCode = initJson['device_code']
        const userCode = initJson['user_code']
        const verificationUri = initJson['verification_uri']
        console.log(`Please visit ${verificationUri} and enter code ${userCode} to authenticate.`)

        while (true) {
            await new Promise(resolve => setTimeout(resolve, 5000))
            const poolResponse = await fetch("https://github.com/login/oauth/access_token", {
                method: "POST",
                headers: {
                    'accept': 'application/json',
                    'editor-version': 'Neovim/0.6.1',
                    'editor-plugin-version': 'copilot.vim/1.16.0',
                    'content-type': 'application/json',
                    'user-agent': 'GithubCopilot/1.155.0',
                    'accept-encoding': 'gzip,deflate,br'
                },
                body: JSON.stringify({
                    client_id: "Iv1.b507a08c87ecfe98",
                    device_code: deviceCode,
                    grant_type: "urn:ietf:params:oauth:grant-type:device_code"
                })
            })
            const poolJson = await poolResponse.json()
            const accessToken = poolJson['access_token'] as string
            if (accessToken) {
                this.store.writeJsonFile<CopilotApiConfig>(this.configFile, {
                    githubAccessToken: accessToken
                })
                break
            }
        }
    }

    private async generateNewToken() {
        const accessToken = this.store.readJsonFile<CopilotApiConfig>(this.configFile).githubAccessToken
        if (!accessToken) {
            throw new ErrorTokenNotSet()
        }

        const tokenResponse = await fetch("https://api.github.com/copilot_internal/v2/token", {
            headers: {
                'authorization': `token ${accessToken}`,
                'editor-version': 'Neovim/0.6.1',
                'editor-plugin-version': 'copilot.vim/1.16.0',
                'user-agent': 'GithubCopilot/1.155.0'
            }
        })
        const tokenJson = await tokenResponse.json()
        const token = tokenJson['token']

        this.store.writeJsonFile<CopilotApiConfig>(this.configFile, {
            githubToken: token
        })
    }

    public async getCommandCompletion({ language = 'bash', prompt, prePrompt = '' }: { prompt: string, language?: string, prePrompt?: string }): Promise<CompletionReturnData[]> {
        await this.generateNewToken()
        const token = this.store.readJsonFile<CopilotApiConfig>(this.configFile).githubToken

        if (prePrompt) {
            prompt = prePrompt + prompt
        }

        const copilotResponse = await fetch('https://copilot-proxy.githubusercontent.com/v1/engines/copilot-codex/completions', {
            method: "POST",
            headers: {
                'authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                'prompt': prompt,
                'suffix': '',
                'max_tokens': 1000,
                'temperature': 0,
                'top_p': 1,
                'n': 1,
                'stop': ['\n'],
                'nwo': 'github/copilot.vim',
                'stream': true,
                'extra': {
                    'language': language
                }

            })
        })
        const copilotText = await copilotResponse.text()
        FILE_LOGGER.debug('Copilot response', { copilotText })
        const allMatchedData = this.reduceIter(copilotText.matchAll(/\{.*\}/g))
            .map(match => JSON.parse(match))
        return allMatchedData
    }

    public async chatCompletion({ chat }: { chat: ChatMessage[] }) {
        await this.generateNewToken()
        const token = this.store.readJsonFile<CopilotApiConfig>(this.configFile).githubToken

        const chatResponse = await fetch('https://api.githubcopilot.com/chat/completions', {
            method: "POST",
            headers: {
                'authorization': `Bearer ${token}`,
                'Editor-Version': 'vscode/1.80.1',
            },
            body: JSON.stringify({
                intent: false,
                model: 'gpt-4o',
                temperature: 0,
                top_p: 1,
                n: 1,
                stream: true,
                messages: chat
            })
        })

        const chatResponseText = await chatResponse.text()
        const matchedDataArr = this.reduceIter(chatResponseText.matchAll(/\{.*\}/g))
            .map(match => JSON.parse(match)) as ChatCompletionChunk[]

        return matchedDataArr.map((v) => v.choices[0]?.delta.content).join('')
    }

    private reduceIter(iter: IterableIterator<RegExpExecArray>) {
        let res = []
        for (const match of iter) {
            res.push(match[0])
        }
        return res
    }
}

type ChatCompletionChunk = {
    id: string,
    created: number,
    model: string,
    system_fingerprint: string,
    choices: [
        {
            index: number,
            content_filter_offsets: {
                check_offset: number,
                start_offset: number,
                end_offset: number
            },
            content_filter_results: {
                error: {
                    code: string,
                    message: string
                },
                hate: {
                    filtered: boolean,
                    severity: string
                },
                self_harm: {
                    filtered: boolean,
                    severity: string
                },
                sexual: {
                    filtered: boolean,
                    severity: string
                },
                violence: {
                    filtered: boolean,
                    severity: string
                }
            },
            delta: {
                content: string
            }
        }
    ]
}

type CompletionReturnData = {
    id: string,
    created: number,
    choices: [
        {
            text: string,
            index: number,
            finish_reason: string
            logprobs: null | any
        }
    ]
}

export {
    CopilotApi,
    ErrorTokenNotSet,
    CompletionReturnData
}
