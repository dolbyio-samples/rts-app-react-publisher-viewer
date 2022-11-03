#!/bin/bash

if [[ -z "${GITHUB_WORKSPACE}" ]]; then
  . ${PWD}/apps/bdd-test/scripts/auto_utils.sh
else
  . ${GITHUB_WORKSPACE}/apps/bdd-test/scripts/auto_utils.sh
fi

PUBLISHER_APP_NAME=publisher
VIEWER_APP_NAME=viewer
> .test.env

# Check if OS is supported
checkOS osType

# Install dependencies
installDependencies

# Deploy publisher app locally
runApp ${PUBLISHER_APP_NAME}

# Verify publisher app server logs
verifyServerLogs ${PUBLISHER_APP_NAME}

# Set App URL Environment variable
getAppURL ${PUBLISHER_APP_NAME}

# Deploy viewer app locally
runApp ${VIEWER_APP_NAME}

# Verify viewer app server logs
verifyServerLogs ${VIEWER_APP_NAME}

# Set App URL Environment variable
getAppURL ${VIEWER_APP_NAME}
