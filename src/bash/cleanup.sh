#!/bin/bash

node_daemon_regex='node .*/ai-cli/bin/run.js inotify-daemon'
my_inotify_regex='.*/my_inotify'
strace_regex='strace'
strace_shell_regex='strace.sh'
inotify_start_shell_regex='inotify-start.sh'
inotifywait_regex='inotifywait'

combined_regex="($node_daemon_regex)|($my_inotify_regex)|($strace_regex)|($strace_shell_regex)|($inotify_start_shell_regex)|($inotifywait_regex)"

kill $(ps aux | rg "$combined_regex" | awk '{print $2}')
