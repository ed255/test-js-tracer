#!/usr/bin/env python3

import os
import subprocess

js = ''
with open('tracer.js') as f:
    js = f.read()

js = js.replace("\n", "")
js = js.replace('"', '\\"')

data = """{
        "jsonrpc":"2.0",
        "method":"debug_traceBlockByNumber",
        "params":["0x8", { "Timeout": "60m", "EnableMemory": true , "tracer": "JS" }],
        "id":1
}""".replace("JS", js)

print(data)

curl = subprocess.Popen(["curl",
    "--location",
    "--request", "POST",
    'http://localhost:8545',
    "--header", 'Content-Type: application/json',
    "--data-raw", data],
     stdout=subprocess.PIPE)
output = subprocess.run(['jq'], stdin=curl.stdout)
