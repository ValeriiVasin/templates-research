#!/bin/sh

# run.sh <directory>
echo "Clean up."
find $1 -name "*.underscore*" -delete

echo "Create underscore templates for all templates inside $1."
find $1 -name "*.tmpl" | xargs -I file node run.js file
