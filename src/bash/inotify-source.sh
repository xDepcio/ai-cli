#!/bin/bash

AI_CLI_DIR="$HOME/.ai-cli"
AI_CLI_SCRIPTS_DIR="$AI_CLI_DIR/scripts"

control_number=0
_mt_test_f()
{
    # echo -n "$READLINE_LINE<=%SEP%=>$READLINE_POINT<=%SEP%=>$PWD" >| ~/.ai-cli/readline_access.txt
    control_number=$(($control_number + 1))
    echo -n "$READLINE_LINE
$READLINE_POINT
$PWD
$control_number" >| $AI_CLI_DIR/readline_contents.txt
}

bind -x '" ": _mt_test_f'

_fill_complete()
{
    completion=$(cat $AI_CLI_DIR/completions.txt)
    completion_length=$(echo -n "$completion" | wc -c)

    READLINE_LINE="$READLINE_LINE$completion"
    READLINE_POINT=$(($READLINE_POINT + $completion_length))
    echo -n '' >| $AI_CLI_DIR/completions.txt
}

bind -x '"\C- ": _fill_complete'

_fill_word()
{
    next_word=$(rg '^ *[!-~]+' $AI_CLI_DIR/completions.txt -o)
    next_word_length=$(echo -n "$next_word" | wc -c)
    sd '^ *[!-~]+' '' $AI_CLI_DIR/completions.txt
    rest=$(cat $AI_CLI_DIR/completions.txt)
    rest_length=$(echo -n "$rest" | wc -c)

    READLINE_LINE="$READLINE_LINE$next_word"
    READLINE_POINT=$(($READLINE_POINT + $next_word_length))
    if [ $rest_length = 0 ]; then
        return
    fi

    ( sleep 0 && echo -e -n "\033[2m$rest\033[0m\033[${rest_length}D" & )
}
bind -x '"\C-n": _fill_word'

switch_on_message="Terminal Copilot is now ON 🤖"
switch_off_message="Terminal Copilot is now OFF 🤖"
_switch_on_off()
{
    status=$(cat $AI_CLI_DIR/status.txt)
    if [ "$status" = "on" ]; then
        echo -n "off" >| $AI_CLI_DIR/status.txt
        echo -e "\033[33;1m${switch_off_message}\033[0m"
    else
        echo -n "on" >| $AI_CLI_DIR/status.txt
        echo -e "\033[32;1m${switch_on_message}\033[0m"
    fi
}

bind -x '"\eq": _switch_on_off'
