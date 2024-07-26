#!/bin/bash

_complete_terminal()
{
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
