mkdir ./public

download_artifact() {
  local artifact_name=$1
  local output_path=$2
  local signed_url=$(curl -X POST -H "Content-Type: application/json" -d "{\"object_key\": \"$artifact_name\"}" $SERVER_BASE_URL/signed-url-generator/sign-url | jq -r '.signed_url')
  curl $signed_url --output $output_path
}

download_artifact "artifacts/library-dictionary-v0001.db" "./public/library-dictionary-v0001.db"
download_artifact "artifacts/library-index-v0001.db" "./public/library-index-v0001.db"
download_artifact "artifacts/library-tracks-v0001.db" "./public/library-tracks-v0001.db"
