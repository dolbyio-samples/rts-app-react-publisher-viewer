#!/bin/bash

if [[ -z "${GITHUB_WORKSPACE}" ]]; then
  . ${PWD}/tests/bdd-atf/scripts/auto_utils.sh
else
  . ${GITHUB_WORKSPACE}/tests/bdd-atf/scripts/auto_utils.sh
fi

APP_NAME=publisher-app

# Check if OS is supported
checkOS osType

# Install dependencies
installDependencies

# Deploy publisher app locally
runApp ${APP_NAME}

# Verify server logs
verifyServerLogs ${APP_NAME}

