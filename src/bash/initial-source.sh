source $AI_CLI_SCRIPTS_DIR/config.sh
alias ai-cli-signin="$AI_CLI_DIR/ai-cli/bin/ai-cli signin"

case $AI_CLI_MODE in
    passive-node-heavy-bind-completion)
        source $AI_CLI_SCRIPTS_DIR/modes/passive-node-heavy-bind-completion/source.sh
        ;;
    active-strace-inotify)
        source $AI_CLI_SCRIPTS_DIR/modes/active-strace-inotify/inotify-source.sh
        ;;
    *)
        echo "Invalid AI_CLI_MODE: $AI_CLI_MODE"
        ;;
esac

if [ "$AI_CLI_ENABLE_CHAT" = "true" ]; then
    source $AI_CLI_SCRIPTS_DIR/other-features/chat/source.sh
fi
