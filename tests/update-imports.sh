#!/bin/bash

# Update all import paths after reorganization

cd "$(dirname "$0")"

echo "Updating import paths..."

# Update all TypeScript files
find . -name "*.ts" -type f -print0 | while IFS= read -r -d '' file; do
    # Skip node_modules and other generated files
    if [[ "$file" == *"node_modules"* ]] || [[ "$file" == *".next"* ]]; then
        continue
    fi

    # Update imports based on file location
    sed -i '' \
        -e "s|from ['\"].*shared/helpers/entities['\"]|from '../../helpers/entities'|g" \
        -e "s|from ['\"].*shared/helpers/api-calls['\"]|from '../../helpers/api-client'|g" \
        -e "s|from ['\"].*shared/interactions/|from '../../interactions/|g" \
        -e "s|from ['\"].*shared/base-test['\"]|from '../../lifecycle/base-test'|g" \
        -e "s|from ['\"].*shared/auth-helpers['\"]|from '../../lifecycle/auth-helpers'|g" \
        -e "s|from ['\"].*shared/shared['\"]|from '../../support/utils'|g" \
        -e "s|from ['\"].*shared/test-config['\"]|from '../../support/config'|g" \
        -e "s|from ['\"].*fixtures/users['\"]|from '../../fixtures/data/users'|g" \
        -e "s|from ['\"].*fixtures/rooms['\"]|from '../../helpers/contexts/room-contexts'|g" \
        "$file"
done

echo "Import paths updated!"
