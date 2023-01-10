#!/bin/bash

if [[ -z "${GITHUB_WORKSPACE}" ]]; then
  . ${PWD}/apps/e2e-test/scripts/auto_utils.sh
else
  . ${GITHUB_WORKSPACE}/apps/e2e-test/scripts/auto_utils.sh
fi

PUBLISHER_APP_NAME=publisher
VIEWER_APP_NAME=viewer


# Check if OS is supported
checkOS osType

# Install dependencies
installDependencies

# Stop publisher app locally
stopApp ${PUBLISHER_APP_NAME}

# Stop viewer app locally
stopApp ${VIEWER_APP_NAME}