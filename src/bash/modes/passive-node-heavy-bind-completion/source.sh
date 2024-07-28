#!/bin/bash

AI_CLI_PASSIVE_COMPLETION_DAEMON_PID_FILE="$AI_CLI_DIR/passive-completion-daemon-pid.txt"

_fill_complete()
{
    # echo $READLINE_LINE
    # echo $READLINE_POINT
    # completion=$(cat $AI_CLI_DIR/passive-completion.txt)
    # completion_length=${#completion}

    # READLINE_LINE="$READLINE_LINE$completion"
    # READLINE_POINT=1

    # echo $READLINE_LINE
    # echo $READLINE_POINT

    # echo -n '' >| $AI_CLI_DIR/passive-completion.txt
    echo xd > /dev/null
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
    if [ -z "$(pgrep -f "ai-cli/bin/run.js passive-completion-daemon")" ]; then
        starting_message="Starting passive completion daemon..."
        echo -e "\033[34;1m${starting_message}\033[0m"

        $AI_CLI_DIR/ai-cli/bin/node $AI_CLI_DIR/ai-cli/bin/run.js passive-completion-daemon &
        echo $! >| $AI_CLI_PASSIVE_COMPLETION_DAEMON_PID_FILE

        sleep 1 # make sure signal handler mounts
        success_message="Daemon started successfully."
        echo -e "\033[32;1m${success_message}\033[0m"
    fi

    prompt="$ ls -al
$(ls -al $PWD)
$ $READLINE_LINE"

    completion=$($AI_CLI_DIR/ai-cli/bin/ai-cli complete -l bash -t "$prompt")
    # completion="xddd"
    completion_daemon_pid=$(cat $AI_CLI_PASSIVE_COMPLETION_DAEMON_PID_FILE)

    echo -n "$READLINE_LINE" >| $AI_CLI_DIR/readline-line.txt
    echo -n "$READLINE_POINT" >| $AI_CLI_DIR/readline-point.txt
    echo -n "$completion" >| $AI_CLI_DIR/passive-completion.txt
    kill -SIGUSR2 $completion_daemon_pid
    # read < <( echo -n "$completion" >| $AI_CLI_DIR/passive-completion.txt & echo $! ) # this write triggers daemon
    # echo -n $REPLY >| $AI_CLI_DIR/passive-completion-trigger-pid.txt
}

bind -x '"\eq": _complete_terminal'
