oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)

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
ai-cli/0.0.0 linux-x64 node-v20.4.0
$ ai-cli --help [COMMAND]
USAGE
  $ ai-cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`ai-cli hello PERSON`](#ai-cli-hello-person)
* [`ai-cli hello world`](#ai-cli-hello-world)
* [`ai-cli help [COMMAND]`](#ai-cli-help-command)
* [`ai-cli plugins`](#ai-cli-plugins)
* [`ai-cli plugins add PLUGIN`](#ai-cli-plugins-add-plugin)
* [`ai-cli plugins:inspect PLUGIN...`](#ai-cli-pluginsinspect-plugin)
* [`ai-cli plugins install PLUGIN`](#ai-cli-plugins-install-plugin)
* [`ai-cli plugins link PATH`](#ai-cli-plugins-link-path)
* [`ai-cli plugins remove [PLUGIN]`](#ai-cli-plugins-remove-plugin)
* [`ai-cli plugins reset`](#ai-cli-plugins-reset)
* [`ai-cli plugins uninstall [PLUGIN]`](#ai-cli-plugins-uninstall-plugin)
* [`ai-cli plugins unlink [PLUGIN]`](#ai-cli-plugins-unlink-plugin)
* [`ai-cli plugins update`](#ai-cli-plugins-update)

## `ai-cli hello PERSON`

Say hello

```
USAGE
  $ ai-cli hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/xDepcio/ai-cli/blob/v0.0.0/src/commands/hello/index.ts)_

## `ai-cli hello world`

Say hello world

```
USAGE
  $ ai-cli hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ ai-cli hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/xDepcio/ai-cli/blob/v0.0.0/src/commands/hello/world.ts)_

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

## `ai-cli plugins`

List installed plugins.

```
USAGE
  $ ai-cli plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ ai-cli plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.14/src/commands/plugins/index.ts)_

## `ai-cli plugins add PLUGIN`

Installs a plugin into ai-cli.

```
USAGE
  $ ai-cli plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into ai-cli.

  Uses bundled npm executable to install plugins into /home/olek/.local/share/ai-cli

  Installation of a user-installed plugin will override a core plugin.

  Use the AI_CLI_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the AI_CLI_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ ai-cli plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ ai-cli plugins add myplugin

  Install a plugin from a github url.

    $ ai-cli plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ ai-cli plugins add someuser/someplugin
```

## `ai-cli plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ ai-cli plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ ai-cli plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.14/src/commands/plugins/inspect.ts)_

## `ai-cli plugins install PLUGIN`

Installs a plugin into ai-cli.

```
USAGE
  $ ai-cli plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into ai-cli.

  Uses bundled npm executable to install plugins into /home/olek/.local/share/ai-cli

  Installation of a user-installed plugin will override a core plugin.

  Use the AI_CLI_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the AI_CLI_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ ai-cli plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ ai-cli plugins install myplugin

  Install a plugin from a github url.

    $ ai-cli plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ ai-cli plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.14/src/commands/plugins/install.ts)_

## `ai-cli plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ ai-cli plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ ai-cli plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.14/src/commands/plugins/link.ts)_

## `ai-cli plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ ai-cli plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ ai-cli plugins unlink
  $ ai-cli plugins remove

EXAMPLES
  $ ai-cli plugins remove myplugin
```

## `ai-cli plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ ai-cli plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.14/src/commands/plugins/reset.ts)_

## `ai-cli plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ ai-cli plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ ai-cli plugins unlink
  $ ai-cli plugins remove

EXAMPLES
  $ ai-cli plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.14/src/commands/plugins/uninstall.ts)_

## `ai-cli plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ ai-cli plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ ai-cli plugins unlink
  $ ai-cli plugins remove

EXAMPLES
  $ ai-cli plugins unlink myplugin
```

## `ai-cli plugins update`

Update installed plugins.

```
USAGE
  $ ai-cli plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.14/src/commands/plugins/update.ts)_
<!-- commandsstop -->
