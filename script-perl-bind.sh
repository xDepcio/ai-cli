_my_readline_access_f()
{
    local input_prompt
    input_prompt="$ $READLINE_LINE"
    echo -n "bash<=%SEP%=>$input_prompt<=%SEP%=>$ ls -al
`ls -al`
<=%SEP%=>$READLINE_POINT<=%SEP%=>$READLINE_LINE" >| ~/.ai-cli/readline_access.txt
#     echo "$READLINE_LINE<=%SEP%=>$READLINE_POINT<=%SEP%=>$ ls -al
# `ls -al`
# $ " >| ~/.ai-cli/readline_access.txt
}

bind -x '" ": _my_readline_access_f'

# _mt_test_f()
# {
#     perl -e 'ioctl STDOUT, 0x5412, $_ for split //, do{ chomp($_ = "e"); $_ }' ;
# }

# bind -x '"\C-b": _mt_test_f'
