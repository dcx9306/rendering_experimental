#!/usr/bin/env bash

IMAGE="rendering_experimental_latest"

CONTAINER_ID=$(docker ps | grep $IMAGE | awk '{ print $1 }')

docker exec -it $CONTAINER_ID /bin/bash
