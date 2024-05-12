#!/bin/bash

AI_CLI_DIR="$HOME/.ai-cli"
AI_CLI_SCRIPTS_DIR="$AI_CLI_DIR/scripts"

strace_log_file="$AI_CLI_DIR/strace.log"
status_file="$AI_CLI_DIR/status.txt"

if [ -z "$1" ]; then
    echo "Usage: $0 <pid>"
    exit 1
fi

strace_size=0
new_strace_size=0
while true; do

    new_strace_size=$(ls -l $strace_log_file | awk '{print $5}')
    if [ "$strace_size" = "$new_strace_size" ]; then
        inotifywait -q -q -e modify "$strace_log_file"
    fi
    strace_size=$(ls -l $strace_log_file | awk '{print $5}')

    status=$(cat $status_file)
    if [ "$status" = "off" ]; then
        inotifywait -q -q -e modify "$status_file"
        continue
    fi

    mapfile -t lines < $AI_CLI_DIR/readline_contents.txt
    last_control_num="${lines[3]}"

    perl -e 'ioctl STDOUT, 0x5412, $_ for split //, do{ chomp($_ = " "); $_ }' ;

    mapfile -t lines < $AI_CLI_DIR/readline_contents.txt
    while [ "${lines[3]}" = "$last_control_num" ]; do
        saved_control="${lines[3]}"
        mapfile -t lines < $AI_CLI_DIR/readline_contents.txt
        if [ -z "${lines[3]}" ]; then
            lines[3]="$saved_control"
            continue
        fi
    done

    echo -n "${lines[0]}<=%SEP%=>${lines[1]}<=%SEP%=>${lines[2]}<=%SEP%=>bash<=%SEP%=>$ ls -al
`ls -al ${lines[2]}`
" >| ~/.ai-cli/readline_access.txt
done
