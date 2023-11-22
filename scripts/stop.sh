docker compose -f ./docker/docker-compose.yaml -p veritable-demo down -v
sleep 1
cd ./von-network
./manage down
sleep 1
cd ../
sleep 0.1
rm -R logs
rm -R *_payloads
ps aux | grep -E "node|react" | awk '{print ($1 ~ /^[0-9]+$/ ? $1 : $2)}' | xargs kill -9
echo DONE