#!/bin/bash

# Netlify Build Script for ContractLab Pro (Monorepo)
set -e

echo "🚀 Starting Netlify build process..."

# Clear any existing cache issues
echo "🧹 Clearing cache..."
rm -rf node_modules/.cache .vite apps/web/dist

# Install dependencies with frozen lockfile
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile --prefer-offline

# Check for missing AI flow files before type checking
echo "🔍 Checking for missing AI flow files..."
if [ ! -d "apps/web/src/features/ai-assistant" ]; then
    echo "⚠️  Warning: ai-assistant directory not found, skipping..."
fi

# Check for any remaining @/ai imports and replace them
echo "🔧 Fixing import paths..."
find apps/web/src -name "*.ts" -o -name "*.tsx" | xargs grep -l "@/ai" 2>/dev/null | while read file; do
    echo "Fixing imports in $file"
    sed -i 's|@/ai/|@/features/ai-assistant/|g' "$file" 2>/dev/null || true
done

# Type check
echo "🔍 Running type check..."
echo "TypeScript version: $(npx tsc --version 2>/dev/null || echo 'not found directly')"
pnpm -F @lawyers/web type-check

# Build the web application
echo "🏗️ Building application..."
pnpm -F @lawyers/web build:netlify

# Verify build output
echo "✅ Verifying build output..."
if [ -d "apps/web/dist" ]; then
    echo "✅ Build successful! apps/web/dist directory created."
    ls -la apps/web/dist/
else
    echo "❌ Build failed! apps/web/dist directory not found."
    exit 1
fi

echo "🎉 Netlify build completed successfully!"
