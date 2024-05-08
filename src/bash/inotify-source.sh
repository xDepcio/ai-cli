#!/bin/bash

control_number=0
_mt_test_f()
{
    # echo -n "$READLINE_LINE<=%SEP%=>$READLINE_POINT<=%SEP%=>$PWD" >| ~/.ai-cli/readline_access.txt
    control_number=$(($control_number + 1))
    echo -n "$READLINE_LINE
$READLINE_POINT
$PWD
$control_number" >| ~/.ai-cli/readline_contents.txt
}

bind -x '" ": _mt_test_f'

_fill_complete()
{
    completion=$(cat ~/.ai-cli/completions.txt)
    completion_length=$(echo -n "$completion" | wc -c)

    READLINE_LINE="$READLINE_LINE$completion"
    READLINE_POINT=$(($READLINE_POINT + $completion_length))
    echo -n '' >| ~/.ai-cli/completions.txt
}

bind -x '"\C- ": _fill_complete'

_fill_word()
{
    next_word=$(rg '^ *[!-~]+' ~/.ai-cli/completions.txt -o)
    next_word_length=$(echo -n "$next_word" | wc -c)
    sd '^ *[!-~]+' '' ~/.ai-cli/completions.txt
    rest=$(cat ~/.ai-cli/completions.txt)
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
    status=$(cat ~/.ai-cli/status.txt)
    if [ "$status" = "on" ]; then
        echo -n "off" >| ~/.ai-cli/status.txt
        echo -e "\033[33;1m${switch_off_message}\033[0m"
    else
        echo -n "on" >| ~/.ai-cli/status.txt
        echo -e "\033[32;1m${switch_on_message}\033[0m"
    fi
}

bind -x '"\eq": _switch_on_off'
