#!/usr/bin/env bash

set -e

apt-get install -y npm

npm install --global yarn
npm install -g n
n 16.5.0
