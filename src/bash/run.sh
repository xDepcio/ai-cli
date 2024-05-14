#!/bin/bash
AI_CLI_DIR="$HOME/.ai-cli"
AI_CLI_SCRIPTS_DIR="$AI_CLI_DIR/scripts"

# nvm use v21.5.0

$AI_CLI_SCRIPTS_DIR/cleanup.sh
source "$AI_CLI_SCRIPTS_DIR/inotify-source.sh"
# $AI_CLI_SCRIPTS_DIR/strace.sh $$ &
$AI_CLI_SCRIPTS_DIR/inotify-start.sh $$ &
$AI_CLI_DIR/ai-cli/bin/ai-cli inotify-daemon &

activate_message="Terminal copilot server started in background. Press 'Alt + q' to toggle it on/off."
echo -e "\033[34;1m${activate_message}\033[0m"
