FROM mcr.microsoft.com/vscode/devcontainers/python:3.11

# [Optional] Uncomment this section to install additional OS packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#     && apt-get -y install --no-install-recommends <your-package-list-here>

# Install development tools
RUN pip install --upgrade pip \
    && pip install black flake8 pytest
