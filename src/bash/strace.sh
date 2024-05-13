#!/bin/bash

AI_CLI_DIR="$HOME/.ai-cli"
AI_CLI_SCRIPTS_DIR="$AI_CLI_DIR/scripts"

# strace -qqq -f -p $1 -s 1000 -e trace=write 2>&1 | rg --line-buffered -o 'write\(2, "[!-~ ]", 1\)' >| /home/olek/.ai-cli/strace.log
sudo strace -qqq -f -p $1 -s 1000 -e trace=write 2>&1 | grep --line-buffered --only-matching 'write(2, "[!-~ A-Za-z\*]", 1)' >| $AI_CLI_DIR/strace.log
