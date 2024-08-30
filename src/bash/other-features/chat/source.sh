
ai_cli_chat() {
    local input response
    input="$(capture_input)"
    echo "fetching response..."
    response=$($AI_CLI_DIR/ai-cli/bin/ai-cli chat -t "[{\"role\": \"user\", \"content\": \"$input\"}]")
    batcat -pp -l md <<EOF
$response
EOF
}

capture_input() {
    input=""
    while IFS= read -r line; do
        if [[ $line == "EOF" ]]; then
            break
        fi
        input+="$line
"
    done
    echo "$input"
}
