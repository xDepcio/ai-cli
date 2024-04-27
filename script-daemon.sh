_my_suggest_func() {
    local input_prompt
    input_prompt="$ $READLINE_LINE"
    echo -n "suggest<=%SEP%=>bash<=%SEP%=>$input_prompt<=%SEP%=>$ ls -al
`ls -al`
<=%SEP%=>$READLINE_POINT<=%SEP%=>$READLINE_LINE" >> ./test.txt
}

_a_my_suggest_func() {
#     local input_prompt a
#     a="a"
#     READLINE_LINE="$READLINE_LINE$a"
#     input_prompt="$ $READLINE_LINE"
#     echo -n "suggest<=%SEP%=>bash<=%SEP%=>$input_prompt<=%SEP%=>$ ls -al
# `ls -al`
# <=%SEP%=>$READLINE_POINT<=%SEP%=>$READLINE_LINE" >> ./test.txt
    echo "xddddddddddddddddd"
}

_my_save_func() {
    echo $READLINE_LINE >> ./test.txt
}

writecmd () {
  perl -e 'ioctl STDOUT, 0x5412, $_ for split //, do{ chomp($_ = <>); $_ }' ;
}


bind -x '"\C-b": _my_suggest_func'
# bind -x '"abc": _a_my_suggest_func'
bind -x '"]": _my_save_func'
# bind -x '"b": _my_suggest_func'
# bind -x '"c": _my_suggest_func'
# bind -x '"d": _my_suggest_func'
# bind -x '"e": _my_suggest_func'
