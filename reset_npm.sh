#!/bin/bash

echo '1. Clear watchman watches'
watchman watch-del-all

echo '2. Delete the `node_modules` folder'
rm -rf node_modules && npm install

echo '3. Reset packager cache'
rm -fr $TMPDIR/react-*

echo '=> done'
