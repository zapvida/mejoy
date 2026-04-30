#!/usr/bin/env bash
set -euo pipefail

echo "🔍 Checking for forbidden Firebase/Google dependencies..."

# Check for Firebase/Google code (excluding Google Fonts)
if grep -r "firebase\|firestore\|firebase-admin" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" . | grep -v node_modules | grep -v .next | grep -v "scripts/migrateFirestoreToSupabase.ts" | grep -v "fonts.googleapis.com" > /dev/null; then
  echo "❌ Firebase code still present. Remove before merge."
  exit 1
fi

echo "✅ No Firebase/Google code found."

# Check for Firebase dependencies in package.json
if grep -i "firebase\|google" package.json > /dev/null; then
  echo "❌ Firebase/Google dependencies still present in package.json"
  exit 1
fi

echo "✅ No Firebase/Google dependencies in package.json"

# Check build
echo "🔨 Testing build..."
npm run build

echo "✅ Build successful!"

# Check environment variables
echo "🔧 Checking environment variables..."
if grep -i "firebase\|google" env.example > /dev/null; then
  echo "❌ Firebase/Google environment variables still present"
  exit 1
fi

echo "✅ Environment variables clean"

echo "🎉 All checks passed! Migration complete."
