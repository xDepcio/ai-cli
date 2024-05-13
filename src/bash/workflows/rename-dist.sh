#!/bin/bash

cd dist
OLD_FILES=$(find ./ -name "*.tar.gz")
NEW_FILES=$(find ./ -name "*.tar.gz" | sed -E 's/(v[0-9]+.[0-9]+.[0-9]+)-[0-9a-zA-Z]*-/\1-/')
for i in $(seq 1 $(echo $OLD_FILES | wc -w)); do
    # mv $(echo $OLD_FILES | cut -d ' ' -f $i) $(echo $NEW_FILES | cut -d ' ' -f $i)
    mv $(echo $OLD_FILES | cut -d ' ' -f $i) $(echo $NEW_FILES | cut -d ' ' -f $i)
done
