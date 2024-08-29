import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('chat', () => {
  it('runs chat cmd', async () => {
    const {stdout} = await runCommand('chat')
    expect(stdout).to.contain('hello world')
  })

  it('runs chat --name oclif', async () => {
    const {stdout} = await runCommand('chat --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
