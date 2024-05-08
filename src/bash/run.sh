#!/bin/bash
nvm use v21.5.0

/home/olek/my-projects-2/ai-cli/src/bash/cleanup.sh
source /home/olek/my-projects-2/ai-cli/src/bash/inotify-source.sh
/home/olek/my-projects-2/ai-cli/src/bash/strace.sh $$ &
/home/olek/my-projects-2/ai-cli/src/bash/inotify-start.sh $$ &
/home/olek/my-projects-2/ai-cli/bin/run.js inotify-daemon &
