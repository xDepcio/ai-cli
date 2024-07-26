#!/bin/bash

_complete_terminal()
{
    if [ -z "$(pgrep -f "./bin/ai-cli passive-completion-daemon")" ]; then
        starting_message="Starting passive completion daemon..."
        echo -e "\033[34;1m${starting_message}\033[0m"

        $AI_CLI_DIR/ai-cli/bin/ai-cli passive-completion-daemon &

        success_message="Daemon started successfully."
        echo -e "\033[32;1m${success_message}\033[0m"
    fi

    prompt="$ ls -al
$(ls -al $PWD)
$ $READLINE_LINE"

    completion=$(./bin/run.js complete -l bash -t "$prompt")

    echo -n "$READLINE_LINE" >| ~/readline-line.txt
    echo -n "$READLINE_POINT" >| ~/readline-point.txt
    read < <( echo -n "$completion" >| ~/passive-completion.txt & echo $! ) # this write triggers daemon
    echo -n $REPLY >| ~/passive-completion-trigger-pid.txt
}

bind -x '"\eq": _complete_terminal'
