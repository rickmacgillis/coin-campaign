const privateEnv = require('../config/private-env.json');
const publicEnv = require( '../config/public-env.json');

const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider(privateEnv.WALLET_MNEMONIC, publicEnv.INFURA_ENDPOINT);
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy using account ' + accounts[0] + ' (This could take several minutes.)');

    const txn = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({ data: '0x' + compiledFactory.evm.bytecode.object })
        .send({ from: accounts[0] });

    console.log('Contract is at ' + txn.options.address);
};
deploy();
