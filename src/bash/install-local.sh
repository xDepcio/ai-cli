#!/bin/bash

AI_CLI_DIR="$HOME/.ai-cli"
AI_CLI_SCRIPTS_DIR="$AI_CLI_DIR/scripts"

nvm use v21.5.0
npm run build

rm -rf $AI_CLI_DIR
mkdir $AI_CLI_DIR
mkdir $AI_CLI_SCRIPTS_DIR
cp ~/my-projects/ai-cli/src/bash/* $AI_CLI_SCRIPTS_DIR -r
chmod +x $AI_CLI_SCRIPTS_DIR/*.sh

/home/adrwal/my-projects/ai-cli/node_modules/.bin/oclif pack tarballs --parallel --no-xz
cp ~/my-projects/ai-cli/dist/ai-cli-v0.0.1-*-linux-x64.tar.gz ~/
cd ~/
tar -xvf ai-cli-v0.0.1-*-linux-x64.tar.gz -C $AI_CLI_DIR
rm ai-cli-v0.0.1-*-linux-x64.tar.gz

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
