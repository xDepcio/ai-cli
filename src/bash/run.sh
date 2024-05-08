#!/bin/bash
nvm use v21.5.0

/home/olek/my-projects-2/ai-cli/src/bash/cleanup.sh
source /home/olek/my-projects-2/ai-cli/src/bash/inotify-source.sh
/home/olek/my-projects-2/ai-cli/src/bash/strace.sh $$ &
/home/olek/my-projects-2/ai-cli/src/bash/inotify-start.sh $$ &
/home/olek/my-projects-2/ai-cli/bin/run.js inotify-daemon &

activate_message="Terminal copilot server started in background. Press 'Alt + q' to toggle it on/off."
echo -e "\033[34;1m${activate_message}\033[0m"
