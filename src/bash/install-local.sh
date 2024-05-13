#!/bin/bash

AI_CLI_DIR="$HOME/.ai-cli"
AI_CLI_SCRIPTS_DIR="$AI_CLI_DIR/scripts"

nvm use v21.5.0
npm run build

mkdir $AI_CLI_DIR
rm -rf $AI_CLI_SCRIPTS_DIR
mkdir $AI_CLI_SCRIPTS_DIR
cp src/bash/*.sh $AI_CLI_SCRIPTS_DIR
chmod +x $AI_CLI_SCRIPTS_DIR/*.sh

rm -rf $AI_CLI_DIR/ai-cli
mkdir $AI_CLI_DIR/ai-cli/bin -p
ln -s /home/olek/my-projects-2/ai-cli/bin/run.js $AI_CLI_DIR/ai-cli/bin/ai-cli
