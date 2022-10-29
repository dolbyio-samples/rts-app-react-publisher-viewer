#!/bin/bash

command='DEBUG=* yarn netlify deploy --auth $NETLIFY_AUTH_TOKEN --dir=$1 --site=$2'
if [[ $BRANCH_REF == 'refs/heads/main' ]]
then
command="${command}  --prod"
else
command="${command}  --alias=DP-$PR_NUM"
fi
eval $command
