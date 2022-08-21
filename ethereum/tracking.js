import web3 from './web3';
import Tracking from './build/Tracking.json';

export default address => {
  return new web3.eth.Contract(JSON.parse(Tracking.interface), address);
};