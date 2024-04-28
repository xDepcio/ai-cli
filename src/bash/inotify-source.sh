#!/bin/bash
_mt_test_f()
{
    echo -n "$READLINE_LINE<=%SEP%=>$READLINE_POINT" >> ~/.ai-cli/readline_access.txt
}

bind -x '" ": _mt_test_f'
