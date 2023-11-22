#!/bin/bash
current_message="Welcome!"
message="$current_message"
while true
do
    while [[ "$message" == "$current_message" ]]
    do
        message=$(curl -s http://localhost:3201/get-latest-message)
        sleep 5
    done
    current_message="$message"
    echo $message > received.sql
    docker cp received.sql smcql_broker:/home/smcql/smcql/received.sql
    docker exec smcql_broker /bin/bash -c "./build_and_execute.sh ./received.sql testDB1 testDB2" > response.txt
    echo Returning response:
    cat response.txt
    # Sanitise the query for transmission to the local container as a URL
    response="$(awk '/Output:/,0' ./response.txt | sed 's/\ /%20/g' | sed 's/\[/%5B/g' | sed 's/\]/%5D/g' | tr '\n' '#' | sed 's/\#/%0A/g' )"
    echo Sanitised for URL:
    echo $response
    curl -s http://localhost:3201/send-message?messageContent=$response
done
