#!/bin/bash
_mt_test_f()
{
    echo -n "$READLINE_LINE<=%SEP%=>$READLINE_POINT<=%SEP%=>$PWD" >| ~/.ai-cli/readline_access.txt
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
