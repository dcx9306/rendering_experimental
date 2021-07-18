#!/usr/bin/env bash

set -e

mkdir -p /tmp/install_rust
cd /tmp/install_rust

curl https://sh.rustup.rs -sSf | sh -s -- -y
