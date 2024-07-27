#!/bin/bash

_fill_complete()
{
    completion=$(cat $AI_CLI_DIR/passive-completion.txt)
    completion_length=$(echo -n "$completion" | wc -c)

    READLINE_LINE="$READLINE_LINE$completion"
    READLINE_POINT=$(($READLINE_POINT + $completion_length))
    echo -n '' >| $AI_CLI_DIR/passive-completion.txt
}

bind -x '"\C- ": _fill_complete'

_fill_word()
{
    next_word=$(rg '^ *[!-~]+' $AI_CLI_DIR/passive-completion.txt -o)
    next_word_length=$(echo -n "$next_word" | wc -c)
    sd '^ *[!-~]+' '' $AI_CLI_DIR/passive-completion.txt
    rest=$(cat $AI_CLI_DIR/passive-completion.txt)
    rest_length=$(echo -n "$rest" | wc -c)

    READLINE_LINE="$READLINE_LINE$next_word"
    READLINE_POINT=$(($READLINE_POINT + $next_word_length))
    if [ $rest_length = 0 ]; then
        return
    fi

    ( sleep 0 && echo -e -n "\033[2m$rest\033[0m\033[${rest_length}D" & )
}
bind -x '"\C-n": _fill_word'

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
