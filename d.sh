echo "alias ai-cli=\"\$AI_CLI_SCRIPTS_DIR/cleanup.sh
strace -qqq -f -p \\\$$ -s 1000 -e trace=write 2>&1 | grep --line-buffered --only-matching 'write(2, \\\"[!-~ A-Za-z\*]\\\", 1)' >| \$AI_CLI_DIR/strace.log &
source \$AI_CLI_DIR/scripts/run.sh\""
