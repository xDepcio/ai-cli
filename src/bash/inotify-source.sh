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
