#!/usr/bin/env bash

set -e

CONTEXT=$(dirname "${BASH_SOURCE[0]}")

DOCKERFILE="$CONTEXT/Dockerfile"

IMAGE="rendering_experimental_latest"

docker build -t $IMAGE -f $DOCKERFILE $CONTEXT
