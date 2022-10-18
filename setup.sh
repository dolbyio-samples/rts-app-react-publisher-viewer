#!/bin/bash
touch .env

echo "------"
echo $stream_name
echo $publishing_token
echo $account_id
echo "------"


echo VITE_MILLICAST_STREAM_NAME=$stream_name >> .env
echo VITE_MILLICAST_STREAM_PUBLISHING_TOKEN=$publishing_token >> .env
echo VITE_MILLICAST_STREAM_ACCOUNT_ID=$account_id >> .env

