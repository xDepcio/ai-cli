#!/bin/bash

# kill $(ps -ef | rg "inotifywait -q -q" | sd "olek[ ]+([0-9]+)[ ]+([0-9]+).*" '$2')
# Define the file to monitor
file_to_monitor="/home/olek/my-projects-2/ai-cli/strace.log"

if [ -z "$1" ]; then
    echo "Usage: $0 <pid>"
    exit 1
fi

# strace -qqq -f -p $1 -s 1000 -e trace=write 2>&1 | rg --line-buffered -o 'write\(2, "[!-~ ]", 1\)' >| ./strace.log &
# Run indefinitely, monitoring for changes to the file
while true; do
    # Use inotifywait to monitor for changes to the file
    inotifywait -q -q -e modify "$file_to_monitor"

    perl -e 'ioctl STDOUT, 0x5412, $_ for split //, do{ chomp($_ = " "); $_ }' ;

    pwd=$(tail /home/olek/.ai-cli/readline_access.txt --lines 1 | sd '.*<=%SEP%=>' '')

    echo -n "<=%SEP%=>bash<=%SEP%=>$ ls -al
`ls -al $pwd`
" >> ~/.ai-cli/readline_access.txt
done
