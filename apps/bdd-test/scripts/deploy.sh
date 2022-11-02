#!/bin/bash

if [[ -z "${GITHUB_WORKSPACE}" ]]; then
  . ${PWD}/apps/bdd-test/scripts/auto_utils.sh
else
  . ${GITHUB_WORKSPACE}/apps/bdd-test/scripts/auto_utils.sh
fi

PUBLISHER_APP_NAME=publisher
VIEWER_APP_NAME=viewer
echo "" > .test_urls.env
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

# Remove color codes
cat .test_urls.env |  sed "s,\\\u001b\[[0-9;]*m,,g" > .test.env
cat .test.env