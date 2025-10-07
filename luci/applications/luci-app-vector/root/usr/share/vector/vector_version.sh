#!/bin/bash

DEFAUTL_BIN_PATH="/tmp/vector/vector"
BIN_PATH_CONFIG_KEY="vector.main.bin_path"
BIN_PATH=$(uci get "$BIN_PATH_CONFIG_KEY")

if [ -z "$BIN_PATH" ]; then
  uci set $BIN_PATH_CONFIG_KEY="$DEFAUTL_BIN_PATH"
  BIN_PATH="$DEFAUTL_BIN_PATH"
fi

if [ -f "$BIN_PATH" ]; then
  current_version=$("$BIN_PATH" --version | awk '{print $2}')
else
  current_version="0.0.0"
fi

echo $current_version
