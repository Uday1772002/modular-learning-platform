#!/bin/bash

# Create Next.js project with all options pre-selected
npx create-next-app@latest frontend \
  --typescript \
  --tailwind \
  --eslint \
  --src-dir \
  --app \
  --import-alias "@/*" \
  --use-npm 