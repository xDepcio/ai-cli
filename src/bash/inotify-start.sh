#!/bin/bash

strace_log_file="/home/olek/.ai-cli/strace.log"
status_file="/home/olek/.ai-cli/status.txt"

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

    perl -e 'ioctl STDOUT, 0x5412, $_ for split //, do{ chomp($_ = " "); $_ }' ;

    pwd=$(tail /home/olek/.ai-cli/readline_access.txt --lines 1 | sd '.*<=%SEP%=>' '')

    echo -n "<=%SEP%=>bash<=%SEP%=>$ ls -al
`ls -al $pwd`
" >> ~/.ai-cli/readline_access.txt
done
