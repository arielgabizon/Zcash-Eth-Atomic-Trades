# Atomic trades for ZEC <-> ETH

Dependencies:
```
node, npm, truffle, python3, python-zcashlib
```

Dev dependencies:
```
ethereumjs-testrpc
```

`npm install -g ethereumjs-testrpc`

`npm install -g truffle`

Run testrpc

`testrpc`

(Port 8545 needs to be free for this)


Deploy the contracts

`truffle deploy`

To run, serve index.js and visit it locally in your browser.

`node index.js`

## To test:

Be sure you have the Metamask plugin installed, and have an account with some testnet ETH on rinkeby.

Run the zcashd client locally, in `-testnet` mode.


Visit
`http://localhost:3000/`
