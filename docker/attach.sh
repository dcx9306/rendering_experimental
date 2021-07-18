#!/usr/bin/env bash

IMAGE="rendering_experimental_latest"

CONTAINER_ID=$(docker ps | grep $IMAGE | awk '{ print $1 }')

docker attach $CONTAINER_ID
