import {expect, test} from '@oclif/test'

describe('strace-daemon', () => {
  test
  .stdout()
  .command(['strace-daemon'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['strace-daemon', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
