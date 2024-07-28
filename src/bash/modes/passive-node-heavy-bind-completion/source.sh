#!/bin/bash

AI_CLI_PASSIVE_COMPLETION_DAEMON_PID_FILE="$AI_CLI_DIR/passive-completion-daemon-pid.txt"

_remove_matching_prefix_suffix()
{
    local first_string="$1"
    local second_string="$2"
    local length=${#first_string}
    local result="$second_string"

    for (( i=1; i<=length; i++ )); do
        suffix="${first_string: -i}"

        if [[ "$second_string" == "$suffix"* ]]; then
            result="${second_string#$suffix}"
            break
        fi
    done

    echo "$result"
}

_send_signal_to_passive_completion_daemon()
{
    read < <( kill -SIGUSR2 $(cat $AI_CLI_PASSIVE_COMPLETION_DAEMON_PID_FILE) & echo $! )
    echo -n $REPLY >| $AI_CLI_DIR/passive-completion-trigger-pid.txt
}

_fill_complete()
{
    completion=$(cat $AI_CLI_DIR/passive-completion.txt)
    remaining_completion=$(_remove_matching_prefix_suffix "$READLINE_LINE" "$completion")

    READLINE_LINE="$READLINE_LINE$remaining_completion"
    READLINE_POINT=${#READLINE_LINE}

    echo -n '' >| $AI_CLI_DIR/passive-completion.txt
}

bind -x '"\C- ": _fill_complete'

_fill_word()
{
    completion=$(cat $AI_CLI_DIR/passive-completion.txt)
    remaining_completion=$(_remove_matching_prefix_suffix "$READLINE_LINE" "$completion")
    first_word=$(echo "$remaining_completion" | sed -E 's/^(\s*)(\S+).*/\1\2/')

    READLINE_LINE="$READLINE_LINE$first_word"
    READLINE_POINT=${#READLINE_LINE}

    echo -n "$(_remove_matching_prefix_suffix "$READLINE_LINE" "$remaining_completion")" >| $AI_CLI_DIR/passive-completion.txt
    echo -n "$READLINE_LINE" >| $AI_CLI_DIR/readline-line.txt
    echo -n "$READLINE_POINT" >| $AI_CLI_DIR/readline-point.txt

    # if [ ! -z "$(cat $AI_CLI_DIR/passive-completion.txt)" ]; then
    _send_signal_to_passive_completion_daemon
    # fi
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

    _send_signal_to_passive_completion_daemon
}

bind -x '"\eq": _complete_terminal'
