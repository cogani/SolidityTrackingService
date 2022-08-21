const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/TrackingFactory.json');

const provider = new HDWalletProvider(
  'evil submit silver whale gesture correct family ticket sorry comfort convince eye',
  'https://rinkeby.infura.io/v3/ad629cbd11de47dd867d80d53fa82c30'
);
const provider2 = new Web3.providers.HttpProvider('http://127.0.0.1:9545');
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log(accounts);

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(
    JSON.parse(compiledFactory.interface)
  )
    .deploy({ data: compiledFactory.bytecode })
    .send({ gas: '5000000', from: accounts[0] });

  console.log('Contract deployed to', result.options.address);
};
deploy();