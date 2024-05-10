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
$ npm install -g mynewcli-test
$ mynewcli-test COMMAND
running command...
$ mynewcli-test (--version)
mynewcli-test/0.0.0 linux-x64 node-v21.5.0
$ mynewcli-test --help [COMMAND]
USAGE
  $ mynewcli-test COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`mynewcli-test help [COMMAND]`](#mynewcli-test-help-command)
* [`mynewcli-test plugins`](#mynewcli-test-plugins)
* [`mynewcli-test plugins add PLUGIN`](#mynewcli-test-plugins-add-plugin)
* [`mynewcli-test plugins:inspect PLUGIN...`](#mynewcli-test-pluginsinspect-plugin)
* [`mynewcli-test plugins install PLUGIN`](#mynewcli-test-plugins-install-plugin)
* [`mynewcli-test plugins link PATH`](#mynewcli-test-plugins-link-path)
* [`mynewcli-test plugins remove [PLUGIN]`](#mynewcli-test-plugins-remove-plugin)
* [`mynewcli-test plugins reset`](#mynewcli-test-plugins-reset)
* [`mynewcli-test plugins uninstall [PLUGIN]`](#mynewcli-test-plugins-uninstall-plugin)
* [`mynewcli-test plugins unlink [PLUGIN]`](#mynewcli-test-plugins-unlink-plugin)
* [`mynewcli-test plugins update`](#mynewcli-test-plugins-update)

## `mynewcli-test help [COMMAND]`

Display help for mynewcli-test.

```
USAGE
  $ mynewcli-test help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for mynewcli-test.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.0.21/src/commands/help.ts)_

## `mynewcli-test plugins`

List installed plugins.

```
USAGE
  $ mynewcli-test plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ mynewcli-test plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.19/src/commands/plugins/index.ts)_

## `mynewcli-test plugins add PLUGIN`

Installs a plugin into mynewcli-test.

```
USAGE
  $ mynewcli-test plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

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
  Installs a plugin into mynewcli-test.

  Uses bundled npm executable to install plugins into /home/olek/.local/share/mynewcli-test

  Installation of a user-installed plugin will override a core plugin.

  Use the MYNEWCLI_TEST_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the MYNEWCLI_TEST_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ mynewcli-test plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ mynewcli-test plugins add myplugin

  Install a plugin from a github url.

    $ mynewcli-test plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ mynewcli-test plugins add someuser/someplugin
```

## `mynewcli-test plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ mynewcli-test plugins inspect PLUGIN...

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
  $ mynewcli-test plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.19/src/commands/plugins/inspect.ts)_

## `mynewcli-test plugins install PLUGIN`

Installs a plugin into mynewcli-test.

```
USAGE
  $ mynewcli-test plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

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
  Installs a plugin into mynewcli-test.

  Uses bundled npm executable to install plugins into /home/olek/.local/share/mynewcli-test

  Installation of a user-installed plugin will override a core plugin.

  Use the MYNEWCLI_TEST_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the MYNEWCLI_TEST_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ mynewcli-test plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ mynewcli-test plugins install myplugin

  Install a plugin from a github url.

    $ mynewcli-test plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ mynewcli-test plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.19/src/commands/plugins/install.ts)_

## `mynewcli-test plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ mynewcli-test plugins link PATH [-h] [--install] [-v]

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
  $ mynewcli-test plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.19/src/commands/plugins/link.ts)_

## `mynewcli-test plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ mynewcli-test plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ mynewcli-test plugins unlink
  $ mynewcli-test plugins remove

EXAMPLES
  $ mynewcli-test plugins remove myplugin
```

## `mynewcli-test plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ mynewcli-test plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.19/src/commands/plugins/reset.ts)_

## `mynewcli-test plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ mynewcli-test plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ mynewcli-test plugins unlink
  $ mynewcli-test plugins remove

EXAMPLES
  $ mynewcli-test plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.19/src/commands/plugins/uninstall.ts)_

## `mynewcli-test plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ mynewcli-test plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ mynewcli-test plugins unlink
  $ mynewcli-test plugins remove

EXAMPLES
  $ mynewcli-test plugins unlink myplugin
```

## `mynewcli-test plugins update`

Update installed plugins.

```
USAGE
  $ mynewcli-test plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.19/src/commands/plugins/update.ts)_
<!-- commandsstop -->
