#!/bin/bash

# Create the logs directory if it doesn't exist
mkdir -p logs

# START VON
cd von-network/
VONIMAGE=`docker images | grep von-network`
[[ ! -z "$VONIMAGE" ]] || ./manage build
./manage start --wait
cd ../

# START F2P ARIES CLOUD AGENT
docker compose -f ./docker/docker-compose.yaml pull 
docker compose -f ./docker/docker-compose.yaml -p veritable-demo up --build -d
echo -en "\n\nWaitingForIssuer"; RES=""; while [[ -z "$RES" ]]; do sleep .1; RES=$(curl -sf localhost:8021/status 2>&1); echo -n .; done
echo -en "\n\nWaitingForHolder"; RES=""; while [[ -z "$RES" ]]; do sleep .1; RES=$(curl -sf localhost:8031/health 2>&1); echo -n .; done
echo -en "\n\nWaitingForVerifier"; RES=""; while [[ -z "$RES" ]]; do sleep .1; RES=$(curl -sf localhost:8041/status 2>&1); echo -n .; done
echo -en "\n\nWaitingForRegulator"; RES=""; while [[ -z "$RES" ]]; do sleep .1; RES=$(curl -sf localhost:8051/status 2>&1); echo -n .; done
echo -e "\n\nDONE"

# START REACT
echo "Starting React clients..."
echo -en "\n\nWaitingForIssuerReact"; RES=""; while [[ -z "$RES" ]]; do sleep .1; RES=$(curl -sf localhost:3002 2>&1); echo -n .; done
echo -en "\n\nWaitingForHolderReact"; RES=""; while [[ -z "$RES" ]]; do sleep .1; RES=$(curl -sf localhost:3001 2>&1); echo -n .; done
echo -en "\n\nWaitingForVerifierReact"; RES=""; while [[ -z "$RES" ]]; do sleep .1; RES=$(curl -sf localhost:3003 2>&1); echo -n .; done
echo -en "\n\nWaitingForRegulatorReact"; RES=""; while [[ -z "$RES" ]]; do sleep .1; RES=$(curl -sf localhost:3004 2>&1); echo -n .; done

# Install dependencies
#!/bin/bash

if [ ! -d "node_modules" ]; then
  npm install
fi

# Start your Node.js applications
echo "Starting Node.js applications..."
node webhook-alice.js > logs/webhook-alice.log 2>&1 &
node webhook-bob.js > logs/webhook-bob.log 2>&1 &
node alice.js > logs/alice.log 2>&1 &
node bob.js > logs/bob.log 2>&1 &

# ABOUT LOGS
echo -e "\n\nAll the backend and frontend logs are ready to be viewed."
echo -e "\n\nDocker backend logs can be viewed with:"
echo -e "docker-compose -f ./docker/docker-compose.yaml -p veritable-demo logs"
