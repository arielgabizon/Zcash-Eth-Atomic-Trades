# Atomic trades for ZEC <-> ETH

## Swap Initialize Example
![swap init example](swap.png)

## Dependencies:
```
node, npm, truffle, python3, python-zcashlib, infura
```

## Install Dev dependencies:
```
npm install
```

## Deploy the contracts to infura rinkeby test network

`truffle migrate --network infurarinkeby`

After you deploy the contract, get the hashlock contract address and update it in `server.js` 

## To run, serve index.js and visit it locally in your browser.

`node index.js`

Visit
`http://localhost:3000/`

## macbook zcash client

Download and install the [zcash macbook client](https://github.com/kozyilmaz/zcash-apple)


### zcash test network

-- todo


## to do
* update `ZBXCAT/zXcat.py` with testnet link to zcashd -daemon -testnet
* get test zcash into wallet from [zcash faucet](https://faucet.testnet.z.cash/) 
* see zcash.rpc.Proxy for interfacing with the zcash client

## To test:

Be sure you have the Metamask plugin installed, and have an account with some testnet ETH on rinkeby.

Run the zcashd client locally, in `-testnet` mode.


## community support
Chat with us on RocketChat at [zcash/alachemy](https://chat.zcashcommunity.com/channel/alchemy)
or on Gitter at [buidldao/Zcash-Eth-Atomic-Trades](https://gitter.im/buidldao/Zcash-Eth-Atomic-Trades)

