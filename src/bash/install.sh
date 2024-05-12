AI_CLI_DIR="$HOME/.ai-cli"
AI_CLI_SCRIPTS_DIR="$AI_CLI_DIR/scripts"

if [ ! -d "$AI_CLI_DIR" ]; then
    mkdir "$AI_CLI_DIR"
else
    rm -rf "$AI_CLI_DIR"
    mkdir "$AI_CLI_DIR"
fi

cd $AI_CLI_DIR
wget https://github.com/xDepcio/ai-cli/releases/download/cli/ai-cli-v0.0.0-c818b7f-linux-x64.tar.gz
tar -xvf ai-cli-v0.0.0-c818b7f-linux-x64.tar.gz
rm ai-cli-v0.0.0-c818b7f-linux-x64.tar.gz

mkdir $AI_CLI_SCRIPTS_DIR
cd $AI_CLI_SCRIPTS_DIR
wget https://raw.githubusercontent.com/xDepcio/ai-cli/master/src/bash/cleanup.sh
wget https://raw.githubusercontent.com/xDepcio/ai-cli/master/src/bash/inotify-start.sh
wget https://raw.githubusercontent.com/xDepcio/ai-cli/master/src/bash/strace.sh
wget https://raw.githubusercontent.com/xDepcio/ai-cli/master/src/bash/inotify-source.sh
wget https://raw.githubusercontent.com/xDepcio/ai-cli/master/src/bash/run.sh


if [ -z "$(which inotifywait)" ]; then
    sudo apt install inotify-tools
fi
