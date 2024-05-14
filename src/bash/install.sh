AI_CLI_DIR="$HOME/.ai-cli"
AI_CLI_SCRIPTS_DIR="$AI_CLI_DIR/scripts"

if [ ! -d "$AI_CLI_DIR" ]; then
    mkdir "$AI_CLI_DIR"
else
    rm -rf "$AI_CLI_DIR"
    mkdir "$AI_CLI_DIR"
fi

cd $AI_CLI_DIR
wget https://github.com/xDepcio/ai-cli/releases/latest/download/ai-cli-v0.0.1-linux-x64.tar.gz
tar -xvf ai-cli-v0.0.1-linux-x64.tar.gz
rm ai-cli-v0.0.1-linux-x64.tar.gz

mkdir $AI_CLI_SCRIPTS_DIR
cd $AI_CLI_SCRIPTS_DIR
wget https://raw.githubusercontent.com/xDepcio/ai-cli/master/src/bash/cleanup.sh
wget https://raw.githubusercontent.com/xDepcio/ai-cli/master/src/bash/inotify-start.sh
wget https://raw.githubusercontent.com/xDepcio/ai-cli/master/src/bash/strace.sh
wget https://raw.githubusercontent.com/xDepcio/ai-cli/master/src/bash/inotify-source.sh
wget https://raw.githubusercontent.com/xDepcio/ai-cli/master/src/bash/run.sh
chmod +x cleanup.sh inotify-start.sh strace.sh inotify-source.sh run.sh


if [ -z "$(which inotifywait)" ]; then
    sudo apt install inotify-tools
fi

if [ -z "$(grep "# ai-cli stuff" $HOME/.bashrc)" ]; then
    echo "# ai-cli stuff" >> $HOME/.bashrc
    echo "export AI_CLI_DIR=\"\$HOME/.ai-cli\"" >> $HOME/.bashrc
    echo "alias ai-cli-signin=\"\$AI_CLI_DIR/ai-cli/bin/ai-cli signin\"" >> $HOME/.bashrc
    echo "alias ai-cli=\"strace -qqq -f -p \$$ -s 1000 -e trace=write 2>&1 | grep --line-buffered --only-matching 'write(2, \"[!-~ A-Za-z\*]\", 1)' >| \$AI_CLI_DIR/strace.log & source \$AI_CLI_DIR/scripts/run.sh\"" >> $HOME/.bashrc
fi
