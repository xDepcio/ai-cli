AI_CLI_DIR="$HOME/.ai-cli"
AI_CLI_SCRIPTS_DIR="$AI_CLI_DIR/scripts"
AI_CLI_PASSIVE_NODE_HEAVY_BIND_COMPLETION_MODE_DIR="$AI_CLI_SCRIPTS_DIR/modes/passive-node-heavy-bind-completion"
AI_CLI_ACTIVE_STRACE_INOTIFY_MODE_DIR="$AI_CLI_SCRIPTS_DIR/modes/active-strace-inotify"
AI_CLI_FEATURES_CHAT_DIR="$AI_CLI_SCRIPTS_DIR/other-features/chat"

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
wget https://raw.githubusercontent.com/xDepcio/ai-cli/master/src/bash/config.sh
wget https://raw.githubusercontent.com/xDepcio/ai-cli/master/src/bash/initial-source.sh
chmod +x config.sh initial-source.sh

mkdir $AI_CLI_PASSIVE_NODE_HEAVY_BIND_COMPLETION_MODE_DIR -p
cd $AI_CLI_PASSIVE_NODE_HEAVY_BIND_COMPLETION_MODE_DIR
wget https://raw.githubusercontent.com/xDepcio/ai-cli/master/src/bash/modes/passive-node-heavy-bind-completion/source.sh
chmod +x source.sh

mkdir $AI_CLI_ACTIVE_STRACE_INOTIFY_MODE_DIR -p
cd $AI_CLI_ACTIVE_STRACE_INOTIFY_MODE_DIR
wget https://raw.githubusercontent.com/xDepcio/ai-cli/master/src/bash/modes/active-strace-inotify/inotify-source.sh
wget https://raw.githubusercontent.com/xDepcio/ai-cli/master/src/bash/modes/active-strace-inotify/run.sh
wget https://raw.githubusercontent.com/xDepcio/ai-cli/master/src/bash/modes/active-strace-inotify/inotify-start.sh
wget https://raw.githubusercontent.com/xDepcio/ai-cli/master/src/bash/modes/active-strace-inotify/cleanup.sh
chmod +x inotify-source.sh run.sh inotify-start.sh cleanup.sh

mkdir $AI_CLI_FEATURES_CHAT_DIR -p
cd $AI_CLI_FEATURES_CHAT_DIR
wget https://raw.githubusercontent.com/xDepcio/ai-cli/master/src/bash/other-features/chat/source.sh
chmod +x source.sh

# Download batcat
cd $AI_CLI_DIR/ai-cli/bin
wget https://github.com/sharkdp/bat/releases/download/v0.24.0/bat-v0.24.0-x86_64-unknown-linux-gnu.tar.gz
tar -xvf bat-v0.24.0-x86_64-unknown-linux-gnu.tar.gz
rm bat-v0.24.0-x86_64-unknown-linux-gnu.tar.gz
mv bat-v0.24.0-x86_64-unknown-linux-gnu/bat bat
rm -rf bat-v0.24.0-x86_64-unknown-linux-gnu

# Add to bashrc
if [ -z "$(grep "# ai-cli stuff" $HOME/.bashrc)" ]; then
    echo "" >> $HOME/.bashrc
    echo "# ai-cli stuff" >> $HOME/.bashrc
    echo "export AI_CLI_DIR=\"\$HOME/.ai-cli\"" >> $HOME/.bashrc
    echo "export AI_CLI_SCRIPTS_DIR=\"\$AI_CLI_DIR/scripts\"" >> $HOME/.bashrc
    echo "source \$AI_CLI_SCRIPTS_DIR/initial-source.sh" >> $HOME/.bashrc
fi
