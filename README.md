# Atomic trades for ZEC <-> ETH

Dependencies:
```
node, npm, truffle, python3, python-zcashlib
```

Dev dependencies:
```
ethereumjs-testrpc
```

`npm install -g test-rpc`
`npm install -g truffle`

Run testrpc

`testrpc`

If port 8545 is being used run
`testrpc -p=<other port number>`

Deploy the contracts

`truffle deploy`

To run, serve index.js and visit it locally in your browser.

`node index.js`
