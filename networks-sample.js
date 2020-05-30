const { projectId, mnemonic } = require('./secrets.json');
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = { 
  networks: {
    development: {
      protocol: 'http',
      host: 'localhost',
      port: 8545,
      gas: 5000000,
      gasPrice: 5e9,
      networkId: '*',
    },
    mordor: { 
      provider: () => new HDWalletProvider(
        mnemonic, `https://www.ethercluster.com/mordor`
      ),
      networkId: 7,
      gasPrice: 10e9
    }
    goerli: {
      provider: () => new HDWalletProvider(
        mnemonic, `https://goerli.infura.io/v3/<insert yout Infura API key>`
      ),
      networkId: 5,
      gasPrice: 10e9    
    }
  },
};
