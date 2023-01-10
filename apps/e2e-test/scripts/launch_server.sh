#!/bin/bash

if [[ -z "${GITHUB_WORKSPACE}" ]]; then
  . ${PWD}/apps/e2e-test/scripts/auto_utils.sh
else
  . ${GITHUB_WORKSPACE}/apps/e2e-test/scripts/auto_utils.sh
fi

PUBLISHER_APP_NAME=publisher
VIEWER_APP_NAME=viewer
> .test.env
rm -rf dist

# Check if OS is supported
checkOS osType

# Install dependencies
installDependencies

# Stop publisher and viewer if running
stopApp ${PUBLISHER_APP_NAME}
stopApp ${VIEWER_APP_NAME}

# Launch viewer app locally
runApp ${VIEWER_APP_NAME}

# Verify viewer app server logs
verifyServerLogs ${VIEWER_APP_NAME}

# Set App URL Environment variable
getAppURL ${VIEWER_APP_NAME}

# Launch publisher app locally
runApp ${PUBLISHER_APP_NAME}

# Verify publisher app server logs
verifyServerLogs ${PUBLISHER_APP_NAME}

# Set App URL Environment variable
getAppURL ${PUBLISHER_APP_NAME}

# Unset environment variables
unsetEnvVariables
