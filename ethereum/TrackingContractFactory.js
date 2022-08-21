import web3 from './web3';
import TrackingFactory from './build/TrackingFactory.json';

// const trackingInstance = new web3.eth.Contract(
//   JSON.parse(Tracking.interface),
//   '0x61F7C78719809Dd43617011A336A199De727A897'
// );

const trackingInstance = new web3.eth.Contract(
  JSON.parse(TrackingFactory.interface),
  '0x18FB6d7d341876C799901d664102ff1A588e0151'
);

export default trackingInstance;