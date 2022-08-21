import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';

let web3;
let provider;

//console('window.web3:',window.web3)

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  // We are in the browser and metamask is running.
  console.log('We are in the browser and metamask is running')
  web3 = new Web3(window.web3.currentProvider);


 


  console.log(web3)
} else {
  // We are on the server *OR* the user is not running metamask
  console.log('We are on the server *OR* the user is not running metamask')
  const provider = new Web3.providers.HttpProvider(
    'https://rinkeby.infura.io/v3/fc5bb87c27f94badb9cdc135883532f7'
  );


  

  console.log('provider', provider)
  console.log('Hi')
  web3 = new Web3(provider);

  console.log('bye')

  //window.ethereum.enable();
}


function cambio(error,data){

  console.log("HOLLLLLLLLLLLA");
}

const configureMoonbaseAlpha = async () => {
  provider = await detectEthereumProvider({
    mustBeMetaMask: true
  })
  console.log('---------Checking provider');
  if (provider) {
    try {
      await provider.request({ method: 'eth_requestAccounts'})
      web3.currentProvider.publicConfigStore.on('update', cambio);
      console.log('---------provider:   ',provider);
    } catch(e) {
      console.error(e)
    }
  } else {
    console.error('Please install MetaMask')
  }
}




configureMoonbaseAlpha()

export default web3;

