#!/bin/bash

 # TODO: deploy different app depends on what files are changed in commit
command='DEBUG=* yarn netlify deploy --auth $NETLIFY_AUTH_TOKEN --dir=apps/publisher/dist --site=astounding-lily-fa33fc'
if [[ $BRANCH_REF == 'refs/heads/main' ]]
then
command="${command}  --prod"
else
command="${command}  --alias=DP-$PR_NUM"
fi
eval $command
