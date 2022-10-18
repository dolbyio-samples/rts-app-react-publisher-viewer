#!/bin/bash
touch .env

echo "-------";
echo $stream_name | sed 's/./& /g'
echo $publishing_token | sed 's/./& /g'
echo $account_id | sed 's/./& /g'
echo "-------";
echo VITE_MILLICAST_STREAM_NAME=$stream_name >> .env
echo VITE_MILLICAST_STREAM_PUBLISHING_TOKEN=$publishing_token >> .env
echo VITE_MILLICAST_STREAM_ACCOUNT_ID=$account_id >> .env

