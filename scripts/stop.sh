docker compose -f ./docker/docker-compose.yaml -p veritable-demo down -v
sleep 1
cd ./von-network
./manage down
sleep 1
cd ../
sleep 0.1
ps aux | grep -E "node|react|python3" | awk '{print $1}' | xargs kill -9
echo DONE