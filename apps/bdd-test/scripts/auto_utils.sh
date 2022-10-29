#!/bin/bash

installDependencies(){
  echo "#################################"
  echo "Install Dependencies"
  echo "#################################"
  yarn global add pm2
  sudo apt-get install -y xsel
  #npx playwright install --force chrome
}

runApp(){
  echo "######################"
  echo "Start the app in dev mode"
  echo "######################"
  local NAME=$1

  pm2 flush ${NAME}
  pm2 flush
  
  pm2 start npm --name ${NAME} -- run preview-pub  
}

verifyServerLogs(){
  echo "###################"
  echo "Verify dev server logs"
  echo "####################"
  local NAME=$1

  local started="false"
  local SUCCESS="ready in"
  local FAIL="error Command failed with exit code|Build failed|ERROR"

  local retry=1
  while [ ${retry} -lt 20 ]
  do
      sleep 2
      local LOGS=$(pm2 logs ${NAME} --nostream --lines 4)
      echo "${LOGS}"
      if [[ ${LOGS} =~ ${FAIL} ]]; then
        echo "Failed to start the development server"
        pm2 logs ${NAME} --nostream
        exit 1 
      elif [[ ${LOGS} =~ ${SUCCESS} ]]; then
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
    pm2 logs ${NAME} --nostream
    exit 1
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