FROM node:20.14-bookworm

# Build arguments
ARG USER_ID=1000
ARG USER_NAME=dev
ARG GROUP_ID=$USER_ID
ARG GROUP_NAME=dev

# Install necessary apps
RUN apt-get update \
    && apt-get install -y git fish sudo \
    && npm install -g @vue/language-server typescript

# Create the user
# RUN getent group ${GROUP_ID} || groupadd --gid ${GROUP_ID} ${GROUP_NAME}
# RUN getent passwd ${USER_ID} || useradd --uid ${USER_ID} --gid ${GROUP_ID} -m ${USER_NAME}
# RUN echo $USER_NAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/${USER_NAME}
# RUN chmod 0440 /etc/sudoers.d/${USER_NAME}
# USER ${USER_NAME}

# Copy files
WORKDIR /workspaces
# COPY --chown=${USER_ID}:${GROUP_ID} . .

# Infinite development loop
CMD ["/bin/bash", "-c", "while true; do sleep 1000; done"]
