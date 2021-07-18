#!/usr/bin/env bash

WORKSPACE=$(dirname $(dirname $(realpath $BASH_SOURCE)))

IMAGE="rendering_experimental_latest"

# -w specify default root directory
# -d run it in background
# -i keep STDIN open if not attached
# -t allocate psuedo tty, needs -i
# -rm remove the container once it's stopped
# --gpus all allow instance use gpus on host machine
# -v mount host fs path to container

CONTAINER_NAME=$(docker run -it -d --rm --gpus all --net host -w /ws -v $WORKSPACE:/ws -v /home/$USER/.bashrc:/root/.bashrc $IMAGE /bin/bash)

if [ "$?" -eq 0 ]; then
    echo "Mouting $WORKSPACE to /ws in container $CONTAINER_NAME"
else
    echo $CONTAINER_NAME
    exit 1
fi
