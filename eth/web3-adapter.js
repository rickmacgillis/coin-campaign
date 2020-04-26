import Web3 from 'web3';
import publicEnv from '../config/public-env.json';

let web3 = null;

// Browser with web3 or server-side, but not browsers without web3.
if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    web3 = new Web3(window.web3.currentProvider);
    window.ethereum.enable();
} else {
    const provider = new Web3.providers.HttpProvider(publicEnv.INFURA_ENDPOINT);
    web3 = new Web3(provider);
}

export default web3;
