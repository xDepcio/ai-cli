prog_dir="$HOME/.ai-cli"
if [ ! -d "$prog_dir" ]; then
    mkdir "$prog_dir"
fi

mkdir "$prog_dir/bin"

cd "$prog_dir/bin"
wget https://github.com/xDepcio/ai-cli/releases/download/cli/ai-cli-v0.0.0-c818b7f-linux-x64.tar.gz
tar -xvf ai-cli-v0.0.0-c818b7f-linux-x64.tar.gz
rm ai-cli-v0.0.0-c818b7f-linux-x64.tar.gz
