
#!/bin/bash

PATH="/usr/sbin:/usr/bin:/sbin:/bin"

ARCH=$(uname -m)
BIN_PATH_CONFIG_KEY="vector.main.bin_path"
BIN_PATH=$(uci get "$BIN_PATH_CONFIG_KEY")
if [ -z "$BIN_PATH" ]; then
  uci set $BIN_PATH_CONFIG_KEY="$DEFAUTL_BIN_PATH"
  BIN_PATH="$DEFAUTL_BIN_PATH"
fi
mkdir -p ${BIN_PATH%/*}

latest_ver=$(curl -sL --retry 2 --connect-timeout 20 \
            "https://api.github.com/repos/vectordotdev/vector/releases?per_page=3" \
            | grep -E 'tag_name' \
            | grep -v 'vdev' \
            | grep -E 'v[0-9.]+' -o \
            | head -n1)

if [ -z "${latest_ver}" ]; then
  echo -e "\nFailed to check latest version, please try again later."  && EXIT 1
fi

echo $latest_ver

echo "Updating to version: $latest_ver"


echo "Detected architecture: $ARCH"
SUPPORTED_ARCH=("x86_64" "aarch64")
if [[ ! " ${SUPPORTED_ARCH[@]} " =~ " ${ARCH} " ]]; then
  echo -e "\nUnsupported architecture: $ARCH" && exit 1
fi

version=${latest_ver#v}
download_url="https://github.com/vectordotdev/vector/releases/download/v${version}/vector-${version}-${arch}-unknown-linux-musl.tar.gz"

echo "Download URL: $download_url"
tmp_dir="/tmp/vector"
mkdir -p "$tmp_dir"

echo -e "\nDownloading vector..."
curl -L --retry 2 --connect-timeout 20 -o "$tmp_dir/vector.tar.gz" "$download_url"
if [ $? -ne 0 ]; then
  echo -e "\nFailed to download vector, please try again later." && exit 1
fi

echo -e "\nExtracting vector..."
tar -xzf "$tmp_dir/vector.tar.gz" -C "$tmp_dir" --strip-components=2 "./vector-${ARCH}-unknown-linux-musl/bin/vector"
if [ $? -ne 0 ]; then
  echo -e "\nFailed to extract vector, please try again later." && exit
fi

if [ ! -f "$tmp_dir/bin/vector" ]; then
  echo -e "\nVector binary not found after extraction, please try again later." && exit 1
fi

echo -e "\nInstalling vector to $binpath ..."
mv "$tmp_dir/bin/vector" "$binpath"
if [ $? -ne 0 ]; then
  echo -e "\nFailed to move vector binary to $binpath, please check permissions." && exit 1
fi

chmod +x "$binpath"
if [ $? -ne 0 ]; then
  echo -e "\nFailed to set execute permissions on $binpath, please check permissions"
fi

echo "Vector updated to version $version successfully!"
rm -rf "$tmp_dir"
rm -f "$VECTOR_UPDATE_RUN_FILE"
exit 0