#!/bin/bash

installDependencies(){
  echo "#################################"
  echo "Install Dependencies"
  echo "#################################"
  yarn global add pm2 strip-ansi-cli
}

runApp(){
  echo "######################"
  echo "Start the $1 app in dev mode"
  echo "######################"
  local NAME=$1
  #yarn nx reset
  pm2 flush ${NAME}
  rm -f ~/.pm2/logs/${NAME}*
  echo pm2 start npm --name ${NAME} -- start ${NAME}:preview
  pm2 start npm --name ${NAME} -- start ${NAME}:preview
}

verifyServerLogs(){
  echo "###################"
  echo "Verify $1 server logs"
  echo "####################"
  local NAME=$1

  local started="false"
  local SUCCESS="Local"
  local FAIL="error Command failed with exit code|Build failed|ERROR|ERR"

  local retry=1
  while [ ${retry} -lt 20 ]
  do
      sleep 3
      local LOGS=$(pm2 logs ${NAME} --nostream)
      echo "${LOGS}"
      local URL_LINE=$(pm2 logs ${NAME} --nostream | grep "Local")
      echo "Server Status: ${URL_LINE}"
      if [[ ${URL_LINE} =~ ${FAIL} ]]; then
        echo "Failed to start the development server"
        pm2 logs ${NAME} --nostream
        exit 1 
      elif [[ ${URL_LINE} =~ ${SUCCESS} ]]; then
        echo "App compiled and started successfully!"
        pm2 logs ${NAME} --nostream
        started="true"
        break
      fi

      echo "Starting the development server..." ${retry}
      ((retry=retry+1))
  done

  if [[ ${started} != "true" ]]; then
    echo "Failed to start the development server"
    pm2 logs ${NAME} --nostream --lines 100
    exit 1
  fi
}

getAppURL(){
  echo "###################"
  echo "Get $1 App URL as env variable"
  echo "####################"
  local NAME=$1

  local URL=$(pm2 logs ${NAME} --nostream | strip-ansi | grep "Local" | awk '{print $NF}')
  echo "URL: ${URL}"

  if [[ ${NAME} == publisher ]];then
    echo "PUBLISHER_URL=$URL" >> .test.env
    export VITE_RTS_PUBLISHER_BASE_URL=$URL
  else
    echo "VIEWER_URL=$URL" >> .test.env
    export VITE_RTS_VIEWER_BASE_URL=$URL
  fi
}


stopApp(){
  echo "###################"
  echo "Stop the dev server"
  echo "####################"
  local NAME=$1

  pm2 flush ${NAME}
  pm2 delete ${NAME}
  pm2 flush
  rm -f ~/.pm2/logs/${NAME}*
}

checkOS(){
  local unameOut="$(uname -s)"
  echo "OS Name: "${unameOut}
  case "${unameOut}" in
      Linux*)     machine=LINUX;;
      Darwin*)    machine=MAC;;
      *)          echo "OS Not Supported!"; exit 1;;
  esac
  echo ${machine}
  eval "${1}=${machine}"
}

unsetEnvVariables(){
  unset VITE_RTS_PUBLISHER_BASE_URL
  unset VITE_RTS_VIEWER_BASE_URL
}