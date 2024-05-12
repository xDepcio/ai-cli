#!/bin/bash
# strace -qqq -f -p $1 -s 1000 -e trace=write 2>&1 | rg --line-buffered -o 'write\(2, "[!-~ ]", 1\)' >| /home/olek/.ai-cli/strace.log
strace -qqq -f -p $1 -s 1000 -e trace=write 2>&1 | grep --line-buffered --only-matching 'write(2, \"[!-~ ]\", 1)' >| /home/olek/.ai-cli/strace.log
