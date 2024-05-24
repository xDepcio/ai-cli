mynewcli-test
=================

A new CLI generated with oclif


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/mynewcli-test.svg)](https://npmjs.org/package/mynewcli-test)
[![Downloads/week](https://img.shields.io/npm/dw/mynewcli-test.svg)](https://npmjs.org/package/mynewcli-test)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g ai-cli
$ ai-cli COMMAND
running command...
$ ai-cli (--version)
ai-cli/0.0.1 linux-x64 node-v21.5.0
$ ai-cli --help [COMMAND]
USAGE
  $ ai-cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`ai-cli complete`](#ai-cli-complete)
* [`ai-cli daemon`](#ai-cli-daemon)
* [`ai-cli help [COMMAND]`](#ai-cli-help-command)
* [`ai-cli inotify-daemon`](#ai-cli-inotify-daemon)
* [`ai-cli signin`](#ai-cli-signin)
* [`ai-cli strace-daemon`](#ai-cli-strace-daemon)

## `ai-cli complete`

```
USAGE
  $ ai-cli complete -l <value> [-f <value>] [-t <value>] [-s] [-p <value>]

FLAGS
  -f, --file=<value>       Take prompt from file
  -l, --language=<value>   (required) Specify completion language.
  -p, --prePrompt=<value>  Text to prepend to prompt.
  -s, --stdin              Use stdin redirection for prompt
  -t, --text=<value>       Take prompt from text string

EXAMPLES
  $ ai-cli complete -l python -f main.py

  $ ai-cli complete -s <<EOF

  $ ai-cli complete -s <prompt.txt

  $ ai-cli complete -f prompt.txt

  $ ai-cli complete -t "Copilot complete this line..."
```

_See code: [src/commands/complete.ts](https://github.com/xDepcio/ai-cli/blob/v0.0.1/src/commands/complete.ts)_

## `ai-cli daemon`

```
USAGE
  $ ai-cli daemon
```

_See code: [src/commands/daemon.ts](https://github.com/xDepcio/ai-cli/blob/v0.0.1/src/commands/daemon.ts)_

## `ai-cli help [COMMAND]`

Display help for ai-cli.

```
USAGE
  $ ai-cli help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for ai-cli.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.0.21/src/commands/help.ts)_

## `ai-cli inotify-daemon`

```
USAGE
  $ ai-cli inotify-daemon
```

_See code: [src/commands/inotify-daemon.ts](https://github.com/xDepcio/ai-cli/blob/v0.0.1/src/commands/inotify-daemon.ts)_

## `ai-cli signin`

Sign in to Github.

```
USAGE
  $ ai-cli signin

DESCRIPTION
  Sign in to Github.
```

_See code: [src/commands/signin.ts](https://github.com/xDepcio/ai-cli/blob/v0.0.1/src/commands/signin.ts)_

## `ai-cli strace-daemon`

```
USAGE
  $ ai-cli strace-daemon -p <value>

FLAGS
  -p, --pid=<value>  (required) bash pid to trace
```

_See code: [src/commands/strace-daemon.ts](https://github.com/xDepcio/ai-cli/blob/v0.0.1/src/commands/strace-daemon.ts)_
<!-- commandsstop -->
