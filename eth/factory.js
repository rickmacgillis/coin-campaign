import web3 from './web3-adapter';
import CampaignFactory from './build/CampaignFactory.json';
import publicEnv from '../config/public-env.json';

const instance = new web3.eth.Contract(
    CampaignFactory.abi,
    publicEnv.FACTORY_ADDRESS
);

export default instance;
