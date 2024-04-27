_my_suggest_func() {
    local prompt input_prompt prefix suffix word
    input_prompt="$ $READLINE_LINE"
#     prompt=$(./bin/run.js complete --text "$input_prompt" --language bash --prePrompt "$ ls -al
# `ls -al`
# ")
    echo -n "suggest<=%SEP%=>bash<=%SEP%=>$input_prompt<=%SEP%=>$ ls -al
`ls -al`
<=%SEP%=>$READLINE_POINT<=%SEP%=>$READLINE_LINE" >> ./test.txt

#     echo -n "suggest<=%SEP%=>bash<=%SEP%=>$input_prompt<=%SEP%=>$ ls -al
# `ls -al`
# <=%SEP%=>$READLINE_POINT<=%SEP%=>$READLINE_LINE" >| ./test2.txt
    # echo "$prompt"
    # word="dupa"
    # prefix="${READLINE_LINE:0:$READLINE_POINT}"
    # suffix="${READLINE_LINE:$READLINE_POINT}"
    # READLINE_LINE="$prefix$word$suffix"
    # echo "$READLINE_LINE"
    # echo "${#READLINE_LINE}"
    # echo "$READLINE_POINT"
    # READLINE_POINT=$((${#READLINE_LINE}))
    # READLINE_LINE="$READLINE_LINE$prompt"
}

bind -x '"\C-b": _my_suggest_func'
