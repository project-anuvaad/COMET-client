echo "Installing dependencies"
export CI=false
npm install
echo "Building ..."
npm run build