#!/bin/sh

# {
#     "id": 1,
#     "method": "debug_traceBlockByNumber",
#     "params": [
#         "0x8",
#         {
#             "tracer": "{depths: [],step: function(log, db) {this.depths.push(log.memory.getUint(-100000));},fault: function() {},result: function() { return this.depths; }}"
#         }
#     ]
# }


curl --location --request POST 'http://localhost:8545' --header 'Content-Type: application/json' --data-raw '{
        "jsonrpc":"2.0",
        "method":"debug_traceBlockByNumber",
        "params":["0x8", { "EnableMemory": true }],
        "id":1
}' | jq

# curl --location --request POST 'http://localhost:8545' --header 'Content-Type: application/json' --data-raw '{
#         "jsonrpc":"2.0",
#         "method":"debug_traceBlockByNumber",
#         "params":["0x8", { "tracer": "" }],
#         "id":1
# }' | jq
