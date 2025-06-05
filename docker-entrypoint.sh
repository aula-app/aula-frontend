#!/usr/bin/env sh
# ================================================================================
# File: docker-entrypoint.sh
# Description: Replaces environment variables in asset files.
# Source: https://github.com/Dutchskull/Vite-Dynamic-Environment-Variables/blob/main/app/env.sh
# ================================================================================

# Set the exit flag to exit immediately if any command fails
set -e

APP_PREFIX="DOCKER_AULA_"
ASSET_DIR="/usr/share/nginx/html"

# Check if the directory exists
if [ ! -d "$ASSET_DIR" ]; then
    # If not, display a warning message and skip to the next iteration
    echo "Warning: directory '$ASSET_DIR' not found, skipping."
    continue
fi

# Display the current directory being scanned
echo "Scanning directory: $ASSET_DIR"

# Iterate through each environment variable that starts with APP_PREFIX
env | grep "^${APP_PREFIX}" | while IFS='=' read -r key value; do
    # Display the variable being replaced
    echo "  • Replacing ${key} → ${value}"

    # Use find and sed to replace the variable in all files within the directory
    find "$ASSET_DIR" -type f -name '*.js' \
        -exec sed -i "s|${key}|${value}|g" {} +
done
