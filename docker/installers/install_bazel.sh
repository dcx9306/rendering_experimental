#!/usr/bin/env bash

set -e

apt-get install -y openjdk-11-jdk

echo "deb [arch=amd64] https://storage.googleapis.com/bazel-apt stable jdk1.8" | tee /etc/apt/sources.list.d/bazel.list
apt-get install -y curl
curl https://bazel.build/bazel-release.pub.gpg | apt-key add -

apt-get update && apt-get install -y bazel