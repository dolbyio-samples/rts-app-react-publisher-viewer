#!/bin/bash

if [[ -z "${GITHUB_WORKSPACE}" ]]; then
  . ${PWD}/apps/bdd-test/scripts/auto_utils.sh
else
  . ${GITHUB_WORKSPACE}/apps/bdd-test/scripts/auto_utils.sh
fi

PUBLISHER_APP_NAME=publisher
VIEWER_APP_NAME=viewer
echo "" > .app
# Check if OS is supported
checkOS osType

# Install dependencies
installDependencies

# Deploy publisher app locally
runApp ${PUBLISHER_APP_NAME}
sleep 5
pm2 logs ${PUBLISHER_APP_NAME} --nostream
LOG_LINE=$(pm2 logs ${PUBLISHER_APP_NAME} --nostream | grep "Local")
echo "Server Status: ${LOG_LINE}"


# Verify publisher app server logs
#verifyServerLogs ${PUBLISHER_APP_NAME}

# Set App URL Environment variable
# setAppURL ${PUBLISHER_APP_NAME}

# Deploy viewer app locally
runApp ${VIEWER_APP_NAME}
sleep 5
pm2 logs ${VIEWER_APP_NAME} --nostream
LOG_LINE=$(pm2 logs ${VIEWER_APP_NAME} --nostream | grep "Local")
echo "Server Status: ${LOG_LINE}"

# Verify viewer app server logs
#verifyServerLogs ${VIEWER_APP_NAME}

# Set App URL Environment variable
# setAppURL ${VIEWER_APP_NAME}
