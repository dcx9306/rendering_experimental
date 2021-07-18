FROM ubuntu:18.04

SHELL ["/bin/bash", "-c"]

RUN apt-get update

COPY installers /tmp/installers

RUN /tmp/installers/install_general.sh
# RUN /tmp/installers/install_bazel.sh

RUN rm -rf /tmp

WORKDIR /ws