# Atomic trades for ZEC <-> ETH

Start by cloning this repository, and enetering the directory of the clone.
You will need the chrome metamask plugin
https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en

2. You will need some Ethereum client, for example geth.

3. Install npm: http://blog.npmjs.org/post/85484771375/how-to-install-npm

4. Install truffle:
`npm install -g truffle`


5. The code assumes you are running the client on the rinekby network and have some balance there. If you want to use a different network you need to deploy the hashlock contract that's in `hashlock.sol`:
`truffle migrate`
`truffle deploy`

and manuall change the contract address here:
https://github.com/arielgabizon/Zcash-Eth-Atomic-Trades/blob/fordemo/index.js#L96

6. Have python 3 or later.

7. Install the zcash pyhton library  easy_install http://github.com/arcalinea/python-zcashlib/tarball/master

8. Run the zcash client, e.g., on testnet:
`zcashd -daemon -testnet`

9. Run the code:
 `Node index.js`
 
 10. Open a browser at `http://localhost:3000/trade/eth/init`



