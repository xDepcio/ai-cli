#!/bin/bash

AI_CLI_DIR="$HOME/.ai-cli"
AI_CLI_SCRIPTS_DIR="$AI_CLI_DIR/scripts"

node_daemon_regex='node .*/ai-cli/bin/run.js inotify-daemon'
my_inotify_regex='.*/my_inotify'
strace_regex='strace'
strace_shell_regex='strace.sh'
inotify_start_shell_regex='inotify-start.sh'
inotifywait_regex='inotifywait'

# combined_regex="($node_daemon_regex)|($my_inotify_regex)|($strace_regex)|($strace_shell_regex)|($inotify_start_shell_regex)|($inotifywait_regex)"
combined_regex="\($node_daemon_regex\)\|\($my_inotify_regex\)\|\($strace_regex\)\|\($strace_shell_regex\)\|\($inotify_start_shell_regex\)\|\($inotifywait_regex\)"

# kill $(ps aux | rg "$combined_regex" | awk '{print $2}')
kill $(ps aux | grep "$combined_regex" | awk '{print $2}')

echo -n '' >| $AI_CLI_DIR/completions.txt
echo -n '' >| $AI_CLI_DIR/readline_access.txt
echo -n '' >| $AI_CLI_DIR/readline_contents.txt
echo -n 'on' >| $AI_CLI_DIR/status.txt
